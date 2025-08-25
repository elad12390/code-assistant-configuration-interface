import crypto from 'crypto';
import http from 'http';
import open from 'open';
import keytar from 'keytar';
import chalk from 'chalk';

const KEYCHAIN_SERVICE = 'caci-configurator';
const KEYCHAIN_ACCOUNT = 'openrouter-api-key';
const OPENROUTER_AUTH_URL = 'https://openrouter.ai/auth';
const OPENROUTER_TOKEN_URL = 'https://openrouter.ai/api/v1/auth/keys';
// Try to find an available port starting from 3000
async function findAvailablePort(startPort: number = 3000): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    
    server.listen(startPort, '127.0.0.1', () => {
      const port = (server.address() as any)?.port as number;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE' && startPort < 3010) {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
}

interface TokenResponse {
  key: string;
  label: string;
}

/**
 * Generate PKCE challenge for OAuth flow
 */
function generatePKCEChallenge(): PKCEChallenge {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  
  return {
    codeVerifier,
    codeChallenge,
  };
}

/**
 * Start a temporary HTTP server to catch OAuth callback
 */
function startCallbackServer(port: number): Promise<{ server: http.Server; code: string }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.url?.startsWith('/callback')) {
        const url = new URL(req.url, `http://localhost:${port}`);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: system-ui; padding: 2rem; text-align: center;">
                <h2 style="color: #ef4444;">Authentication Failed</h2>
                <p>Error: ${error}</p>
                <p>You can close this window and try again.</p>
              </body>
            </html>
          `);
          reject(new Error(`OAuth error: ${error}`));
          return;
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: system-ui; padding: 2rem; text-align: center;">
                <h2 style="color: #22c55e;">✅ Authentication Successful!</h2>
                <p>You can now close this window and return to your terminal.</p>
                <script>setTimeout(() => window.close(), 3000);</script>
              </body>
            </html>
          `);
          resolve({ server, code });
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: system-ui; padding: 2rem; text-align: center;">
                <h2 style="color: #ef4444;">Authentication Failed</h2>
                <p>No authorization code received.</p>
                <p>You can close this window and try again.</p>
              </body>
            </html>
          `);
          reject(new Error('No authorization code received'));
        }
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, '127.0.0.1', () => {
      console.log(chalk.dim(`Debug: Callback server listening on port ${port}`));
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${port} is already in use. Please close other applications using this port.`));
      } else {
        reject(new Error(`Failed to start callback server: ${err.message}`));
      }
    });
  });
}

/**
 * Exchange authorization code for API key
 */
async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<string> {
  const response = await fetch(OPENROUTER_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,
      code_challenge_method: 'S256',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Token exchange failed: ${response.status}`;
    
    // Try to parse error details
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.message) {
        errorMessage += ` - ${errorData.error.message}`;
      }
      if (errorData.error?.code === 409) {
        errorMessage += ' (OpenRouter OAuth service conflict - this usually means there\'s an issue with app creation or the OAuth flow)';
        console.log(chalk.dim(`Debug: Full error response: ${errorText}`));
      }
      if (errorData.user_id) {
        console.log(chalk.dim(`Debug: Associated user ID: ${errorData.user_id}`));
      }
    } catch {
      errorMessage += ` ${errorText}`;
    }
    
    throw new Error(errorMessage);
  }

  const tokenResponse = await response.json() as TokenResponse;
  return tokenResponse.key;
}

/**
 * Store API key securely in system keychain
 */
export async function storeApiKey(apiKey: string): Promise<void> {
  try {
    await keytar.setPassword(KEYCHAIN_SERVICE, KEYCHAIN_ACCOUNT, apiKey);
  } catch (error) {
    throw new Error(`Failed to store API key in keychain: ${error}`);
  }
}

/**
 * Retrieve API key from system keychain
 */
export async function getStoredApiKey(): Promise<string | null> {
  try {
    return await keytar.getPassword(KEYCHAIN_SERVICE, KEYCHAIN_ACCOUNT);
  } catch (error) {
    console.warn(`Failed to retrieve API key from keychain: ${error}`);
    return null;
  }
}

/**
 * Clear stored API key (for logout)
 */
export async function clearStoredApiKey(): Promise<void> {
  try {
    await keytar.deletePassword(KEYCHAIN_SERVICE, KEYCHAIN_ACCOUNT);
  } catch (error) {
    console.warn(`Failed to clear API key from keychain: ${error}`);
  }
}

/**
 * Perform OAuth PKCE flow to get API key with fallback to manual entry
 */
export async function performOAuthFlow(): Promise<string> {
  console.log(chalk.blue('\n🔐 Authenticating with OpenRouter...\n'));

  // Try simplified OAuth first, then PKCE if that fails
  try {
    return await performSimpleOAuth();
  } catch (error) {
    console.log(chalk.yellow('Simple OAuth failed, trying PKCE flow...'));
    return await performPKCEOAuth();
  }
}

/**
 * Perform simple OAuth without PKCE as fallback
 */
async function performSimpleOAuth(): Promise<string> {
  // Find an available port
  const availablePort = await findAvailablePort();
  const redirectUri = `http://localhost:${availablePort}/callback`;
  
  // Build simple authorization URL
  const authUrl = new URL(OPENROUTER_AUTH_URL);
  authUrl.searchParams.set('callback_url', redirectUri);

  console.log(chalk.dim(`Debug: Simple OAuth - Using callback URL: ${redirectUri}`));

  // Start callback server
  const serverPromise = startCallbackServer(availablePort);

  console.log(chalk.yellow('Opening your browser for authentication...'));
  console.log(chalk.dim(`If the browser doesn't open automatically, visit: ${authUrl.toString()}\n`));

  // Open browser
  await open(authUrl.toString());

  // Wait for callback with timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Authentication timed out after 5 minutes')), 5 * 60 * 1000);
  });

  const { server, code } = await Promise.race([serverPromise, timeoutPromise]);

  console.log(chalk.green('✅ Authorization received, exchanging for API key...'));

  // Close server
  server.close();

  // Exchange code for token (without PKCE)
  const response = await fetch(OPENROUTER_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Simple OAuth token exchange failed: ${response.status} ${errorText}`);
  }

  const tokenResponse = await response.json() as TokenResponse;

  // Store in keychain
  await storeApiKey(tokenResponse.key);

  console.log(chalk.green('🎉 Simple OAuth authentication successful! API key stored securely.'));
  return tokenResponse.key;
}

/**
 * Perform PKCE OAuth flow
 */
async function performPKCEOAuth(): Promise<string> {
  try {
    // Find an available port
    const availablePort = await findAvailablePort();
    const redirectUri = `http://localhost:${availablePort}/callback`;
    
    // Generate PKCE challenge
    const { codeVerifier, codeChallenge } = generatePKCEChallenge();

    // Build authorization URL with minimal parameters first
    const authUrl = new URL(OPENROUTER_AUTH_URL);
    authUrl.searchParams.set('callback_url', redirectUri);
    
    // Add PKCE parameters only if they might not be causing issues
    // Some OAuth services are sensitive to parameter order or format
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('code_challenge', codeChallenge);

    console.log(chalk.dim(`Debug: Using callback URL: ${redirectUri}`));
    console.log(chalk.dim(`Debug: Code challenge: ${codeChallenge.substring(0, 10)}...`));

    // Start callback server
    const serverPromise = startCallbackServer(availablePort);

    console.log(chalk.yellow('Opening your browser for authentication...'));
    console.log(chalk.dim(`If the browser doesn't open automatically, visit: ${authUrl.toString()}\n`));

    // Open browser
    await open(authUrl.toString());

    // Wait for callback with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Authentication timed out after 5 minutes')), 5 * 60 * 1000);
    });

    const { server, code } = await Promise.race([serverPromise, timeoutPromise]);

    console.log(chalk.green('✅ Authorization received, exchanging for API key...'));

    // Close server
    server.close();

    // Exchange code for token
    const apiKey = await exchangeCodeForToken(code, codeVerifier);

    // Store in keychain
    await storeApiKey(apiKey);

    console.log(chalk.green('🎉 Authentication successful! API key stored securely.'));
    return apiKey;

  } catch (error) {
    console.log(chalk.yellow('\n⚠️  OAuth flow encountered an issue. Let\'s try manual authentication instead.\n'));
    
    // Fallback to manual API key entry
    return await promptForManualApiKey();
  }
}

/**
 * Prompt user for manual API key entry
 */
export async function promptForManualApiKey(): Promise<string> {
  const inquirer = (await import('inquirer')).default;
  
  console.log(chalk.cyan('You can get your OpenRouter API key from: https://openrouter.ai/keys\n'));
  
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your OpenRouter API key:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'API key is required';
        }
        if (!input.startsWith('sk-or-')) {
          return 'OpenRouter API keys should start with "sk-or-"';
        }
        return true;
      },
      mask: '*',
    },
  ]);

  try {
    // Store in keychain
    await storeApiKey(apiKey as string);
    console.log(chalk.green('✅ API key stored securely!'));
    return apiKey as string;
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not store API key in keychain, but continuing...'));
    return apiKey as string;
  }
}

/**
 * Get API key, performing OAuth flow if needed
 */
export async function getApiKey(): Promise<string | null> {
  // First, check if we have a stored key
  const storedKey = await getStoredApiKey();
  if (storedKey) {
    console.log(chalk.green('✅ Using stored authentication'));
    return storedKey;
  }

  // If no stored key, perform OAuth flow
  try {
    const newKey = await performOAuthFlow();
    return newKey;
  } catch (error) {
    console.error(chalk.red(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`));
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const apiKey = await getStoredApiKey();
  return apiKey !== null;
}