import getEnvironment from './environment';

const {
  REACT_APP_AUTH_ENABLED,
  REACT_APP_AUTH_LOGOUT_URI,
  REACT_APP_AUTH_REDIRECT_URI,
  REACT_APP_AUTH_ISSUER,
  REACT_APP_AUTH_CLIENT_ID,
} = getEnvironment();

export default {
  enabled: typeof REACT_APP_AUTH_ENABLED === 'undefined' ? true : REACT_APP_AUTH_ENABLED as any as string === 'true',
  logoutUri: REACT_APP_AUTH_LOGOUT_URI,
  appAuth: {
    issuer: REACT_APP_AUTH_ISSUER,
    clientId: REACT_APP_AUTH_CLIENT_ID,
    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://aci-primary-dev.auth.us-east-1.amazoncognito.com/oauth2/token',
    //   tokenEndpoint: 'https://aci-primary-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize',
    //   registrationEndpoint: 'https://aci-primary-dev.auth.us-east-1.amazoncognito.com/oauth2/token',
    //   revocationEndpoint: REACT_APP_AUTH_LOGOUT_URI,
    // },
    scopes: [
      'profile',
      'openid profile',
      'aci_order_api/access_all',
      'aci_inspect_api/access_all',
      'aci_sketch_api/access_all',
      'aci_inspection_sketch_api/access_all',
    ],
    redirectUrl: REACT_APP_AUTH_REDIRECT_URI || 'host.exp.exponent:/oauthredirect',
  },
};
