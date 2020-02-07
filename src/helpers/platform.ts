import { Platform } from 'react-native';
import { IOS, ANDROID } from 'constants/platform';

export const PLATFORM = Platform.OS === IOS ? IOS : ANDROID;
export const isIOS = (): boolean => Platform.OS === IOS;
export const isAndroid = (): boolean => Platform.OS === ANDROID;
