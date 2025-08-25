// Mock implementation for OAuth module

export async function getStoredApiKey(): Promise<string | null> {
  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  return false;
}

export async function performOAuthFlow(): Promise<string> {
  return 'mock-api-key';
}

export async function getApiKey(): Promise<string | null> {
  return null;
}

export async function clearStoredApiKey(): Promise<void> {
  return;
}