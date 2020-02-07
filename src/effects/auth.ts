import * as AppAuth from 'expo-app-auth';

import authConfig from 'config/authConfig';
import { ToasterActions, ToastLevels } from 'components/Toaster';


export const login = (): Promise<AppAuth.TokenResponse> => {
  try {
    return AppAuth.authAsync(authConfig.appAuth);
  } catch (error) {
    console.error(`Authentication error: ${error.message}`, error);
    ToasterActions.addToast(`Authentication error: ${error.message}`, ToastLevels.ERROR);
    throw error;
  }
};

export const refresh = (refreshToken: string): Promise<AppAuth.TokenResponse> => {
  try {
    return AppAuth.refreshAsync(
      authConfig.appAuth,
      refreshToken,
    );
  } catch (error) {
    console.error(`Token refresh error: ${error.message}`, error);
    ToasterActions.addToast(`Token refresh error: ${error.message}`, ToastLevels.ERROR);
    throw error;
  }
};

export const logout = (): Promise<Response> => {
  // we should be able to just use AppAuth.revokeAsync here, but Cognito doesn't seem to support it
  // await AppAuth.revokeAsync(authConfig.appAuth, { token, isClientIdProvided: true });
  const { logoutUri, appAuth } = authConfig;
  const uri = `${logoutUri}?client_id=${appAuth.clientId}&redirect_uri=${appAuth.redirectUrl}`;
  try {
    return fetch(uri);
  } catch (error) {
    console.error(`Logout error: ${error.message}`, error);
    throw error;
  }
};
