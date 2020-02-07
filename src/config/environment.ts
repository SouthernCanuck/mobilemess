
import Constants from 'expo-constants';
import {
  REACT_APP_AUTH_ENABLED,
  REACT_APP_AUTH_LOGOUT_URI,
  REACT_APP_AUTH_REDIRECT_URI,
  REACT_APP_SKETCH_URL,
  REACT_APP_AUTH_ISSUER,
  REACT_APP_AUTH_CLIENT_ID,
  REACT_APP_API_BASE_URL,
} from 'react-native-dotenv';


interface EnvironmentType {
  REACT_APP_AUTH_ENABLED?: boolean;
  REACT_APP_AUTH_LOGOUT_URI?: string;
  REACT_APP_AUTH_REDIRECT_URI?: string;

  REACT_APP_SKETCH_URL?: string;

  REACT_APP_AUTH_ISSUER: string;
  REACT_APP_AUTH_CLIENT_ID: string;

  REACT_APP_API_BASE_URL: string;
}
export interface EnvironmentsType { [key: string]: EnvironmentType }

export default (env: string = Constants.manifest.releaseChannel): EnvironmentType => ({
  REACT_APP_AUTH_ENABLED,
  REACT_APP_AUTH_LOGOUT_URI,
  REACT_APP_AUTH_REDIRECT_URI,
  REACT_APP_SKETCH_URL,
  REACT_APP_AUTH_ISSUER,
  REACT_APP_AUTH_CLIENT_ID,
  REACT_APP_API_BASE_URL,
});
