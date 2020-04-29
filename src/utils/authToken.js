const KEY = 'auth_token';

export function getStoredAuthToken() {
  return JSON.parse(window.localStorage.getItem(KEY));
}

export function storeAuthToken(data) {
  window.localStorage.setItem(KEY, data);
}

export function removeStoredAuthToken() {
  window.localStorage.removeItem(KEY);
}
