// Mock implementation for OAuth module

// eslint-disable-next-line @typescript-eslint/require-await
export async function getStoredApiKey(): Promise<string | null> {
  return null;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function isAuthenticated(): Promise<boolean> {
  return false;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function performOAuthFlow(): Promise<string> {
  return 'mock-api-key';
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function getApiKey(): Promise<string | null> {
  return null;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function clearStoredApiKey(): Promise<void> {
  return;
}