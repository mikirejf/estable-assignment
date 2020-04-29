const apiUrl = 'https://es-api-gateway-test.azurewebsites.net/';

export default {
  login: `${apiUrl}users/account/login`,
  tokenRefresh: `${apiUrl}users/account/tokenrefresh`,
  graphql: `${apiUrl}graphql`,
};
