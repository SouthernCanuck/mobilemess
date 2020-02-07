import React, { useEffect, useState } from 'react';
import { ScreenOrientation } from 'expo';
import * as Font from 'expo-font';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';

import authConfig from 'config/authConfig';
import { selectors, actions } from 'ducks/auth';
import { CenterContainer } from 'components/elements/containers';
import AppNavigator from './AppNavigator';
import Toaster from './Toaster';


const AppContainer = createAppContainer(AppNavigator);

interface StateProps {
  loading: boolean;
}

interface ExternalProps {
  accessTokenExpirationTime?: number;
}

interface DispatchProps {
  login: Function;
}
type Props = StateProps & ExternalProps & DispatchProps

const initUI = async (): Promise<void> => {
  /* eslint-disable global-require */
  await Font.loadAsync({
    Light: require('../../assets/fonts/SourceSansPro-Light.otf'),
    Regular: require('../../assets/fonts/SourceSansPro-Regular.otf'),
    Semibold: require('../../assets/fonts/SourceSansPro-Semibold.otf'),
    Bold: require('../../assets/fonts/SourceSansPro-Bold.otf'),
  });
  /* eslint-enable global-require */
  await ScreenOrientation.unlockAsync();
};

const App = ({
  accessTokenExpirationTime, login,
}: Props): JSX.Element|null => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Create an scoped async function in the hook
    async function loadUI(): Promise<void> {
      await initUI();
      setLoading(false);
    }
    // Execute the created function directly
    loadUI();
  }, []);

  if (isLoading) {
    return null;
  }

  const nowTime = new Date().getTime();

  if (!authConfig.enabled || (accessTokenExpirationTime && accessTokenExpirationTime > nowTime)) {
    console.info(`Authorized until ${new Date(accessTokenExpirationTime!).toUTCString()}`);
    return (
      <MenuProvider>
        <Toaster>
          <AppContainer />
        </Toaster>
      </MenuProvider>
    );
  }
  console.info('Not Authorized - Logging In');
  login();
  return (
    <CenterContainer>
      <Text>Authorizing</Text>
    </CenterContainer>
  );
};

export default connect<ExternalProps, DispatchProps>(
  (state: any) => ({
    accessTokenExpirationTime: selectors.getAccessTokenExpirationTime(state),
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      login: actions.login,
    },
    dispatch,
  ),
)(App);
