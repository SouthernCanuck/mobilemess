# OIDC Authentication Settings
`REACT_APP_AUTH_ENABLED`=`true` if authentication should be enabled (default for non-development environments), `false` otherwise (default for development environments)
*Note:* when authentication is _not_ enabled, some features (such as loading and saving) will be disabled.

## URLs for AWS cognito server
`REACT_APP_AUTH_ISSUER`==_AWS cognito server authorisation URL_
`REACT_APP_AUTH_LOGOUT_URI`=_AWS cognito server logout URL_

## Unique application specific client identifier for OpenID Provider
`REACT_APP_AUTH_CLIENT_ID`=_clientId_

## Callback URLs
`REACT_APP_AUTH_REDIRECT_URI`=`host.exp.exponent:/oauthredirect`
*Note:* values correct for (local) development environment.

# FirstAm API Server Settings
`REACT_APP_API_BASE_URL`=_base URL to linked FirstAm inspection API deployment_

# Link to sketch app
REACT_APP_SKETCH_URL=_base URL to linked sketch application deployment, including sketchId parameter (e.g. "https://firstam-sketchpad-dev.herokuapp.com/?sketchId=")_
