const KEY = 'auth_token';

export function getStoredAuthTokens() {
  return JSON.parse(window.localStorage.getItem(KEY));
}

export function storeAuthTokens(data) {
  window.localStorage.setItem(KEY, data);
}

export function removeStoredAuthTokens() {
  window.localStorage.removeItem(KEY);
}
