export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  try {
    const response = await fetch(input, { ...init, headers });
    return response;
  } catch (error) {
    // Only log non-sensitive error information
    console.error('fetchWithAuth error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}


