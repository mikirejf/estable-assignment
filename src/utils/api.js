import {
  storeAuthTokens,
  getStoredAuthTokens,
  removeStoredAuthTokens,
} from 'utils/authTokens';
import fetchClient from './fetchClient';

const defaults = {
  baseUrl: 'https://es-api-gateway-test.azurewebsites.net',
  headers: () => {
    const authTokens = getStoredAuthTokens();
    return {
      'Content-Type': 'application/json',
      Authorization: authTokens ? `Bearer ${authTokens.token}` : null,
    };
  },
};

function generateTokenRefreshRequest(oldAuthTokens) {
  return fetchClient({
    method: 'POST',
    url: `${defaults.baseUrl}/users/account/tokenrefresh`,
    headers: defaults.headers(),
    body: oldAuthTokens,
  }).promise;
}

// TODO: remove `onLogout` parameter when possible
function api(method, endpoint, body, onLogout) {
  const logout = () => {
    removeStoredAuthTokens();
    onLogout();
  };

  const generateRequest = () =>
    fetchClient({
      method,
      url: `${defaults.baseUrl}${endpoint}`,
      headers: defaults.headers(),
      body,
    }).promise;

  return new Promise(async (resolve, reject) => {
    const authTokens = getStoredAuthTokens();

    try {
      const response = await generateRequest();
      resolve(response);
    } catch (error) {
      const errorObj = JSON.parse(error.message);

      if (errorObj.status === 401) {
        if (authTokens) {
          try {
            const newAuthTokens = await generateTokenRefreshRequest(authTokens);
            storeAuthTokens(newAuthTokens);
            try {
              const retryResponse = await generateRequest();
              resolve(retryResponse);
            } catch (retryError) {
              reject(retryError);
            }
          } catch (tokenRefreshError) {
            logout();
          }
        } else {
          logout();
        }
      } else {
        reject(error);
      }
    }
  });
}

export default {
  post: (endpoint, body, onLogout) => api('POST', endpoint, body, onLogout),
};
