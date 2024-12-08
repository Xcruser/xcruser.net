import crypto from 'crypto';

// Generiere einen temporären Client-Key
export const generateClientKey = () => {
  return crypto.randomBytes(32).toString('base64');
};

// Speichere den Key im localStorage
export const storeClientKey = (key: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('client_key', key);
  }
};

// Hole den Key aus dem localStorage
export const getClientKey = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('client_key');
  }
  return null;
};

// Füge den Key zu den Request Headers hinzu
export const addClientKeyToHeaders = (headers: Headers) => {
  const clientKey = getClientKey();
  if (clientKey) {
    headers.set('X-Client-Key', clientKey);
  }
  return headers;
};
