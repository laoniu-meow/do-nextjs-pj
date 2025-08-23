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
  return fetch(input, { ...init, headers });
}


