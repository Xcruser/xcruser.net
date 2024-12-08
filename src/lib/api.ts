import { addClientKeyToHeaders } from './auth';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  addClientKeyToHeaders(headers);

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ein Fehler ist aufgetreten');
  }

  return response.json();
}
