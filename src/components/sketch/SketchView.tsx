import React, { Component } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import authConfig from 'config/authConfig';
import { sketchConfig } from 'config/sketchConfig';
import { selectors as authSelectors } from 'ducks/auth';
import { actions as sketchActions, PostToSketch } from 'ducks/sketch';

import { FromSketchMessage, ToSketchMessage, ToSketchMessageType } from 'types/sketch';
import { postMessageScript, localStorageAuthScript } from './injectedScripts';

interface InputProps {
  sketchId: string;
}

interface StateProps {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
}

interface DispatchProps {
  setPostToSketch: (postToSketch?: PostToSketch) => void;
  fromSketchMessage: (message: FromSketchMessage) => void;
  setSketchData: (sketchId: string) => void;
}

type Props = InputProps & StateProps & DispatchProps & NavigationInjectedProps;

class SketchView extends Component<Props> {
  private webView: WebView | null;

  public constructor(props: Props) {
    super(props);
    this.webView = null;
  }

  public componentDidMount() {
    const { setPostToSketch, setSketchData, sketchId } = this.props;
    setPostToSketch(this.postToSketch);
    setSketchData(sketchId);
  }

  public componentWillUnmount() {
    this.props.setPostToSketch(undefined);
  }

  private postToSketch = (message: ToSketchMessage) => {
    if (this.webView) {
      console.info('Sending message', JSON.stringify(message));
      this.webView.injectJavaScript(postMessageScript(message));
    } else {
      console.error('Can\'t post to webview');
    }
  }

  private onMessage = (event: WebViewMessageEvent): void => {
    const { sketchId, fromSketchMessage } = this.props;
    const message = JSON.parse(event.nativeEvent.data);
    console.info(`Message received for sketchId ${sketchId}`, JSON.stringify(message));
    fromSketchMessage(message);
  }

  public render(): JSX.Element {
    const {
      sketchId, idToken, accessToken, refreshToken, tokenExpiry,
    } = this.props;
    const authKey = `oidc.user:${authConfig.appAuth.issuer}:${authConfig.appAuth.clientId}`;
    /* eslint-disable @typescript-eslint/camelcase */
    const authValue = JSON.stringify({
      id_token: idToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_at: tokenExpiry,
    });
    /* eslint-enable @typescript-eslint/camelcase */

    return (
      <WebView
        ref={(ref) => { this.webView = ref; }}
        source={{
          uri: `${sketchConfig.sketchUrl}${sketchId}`,
        }}
        onMessage={this.onMessage}
        onError={err => console.error(err)}
        onLoadStart={() => {
          this.webView!.injectJavaScript(localStorageAuthScript(authKey, authValue));
        }}
      />
    );
  }
}

export default connect<StateProps>(
  (state: any) => ({
    idToken: authSelectors.getIdToken(state),
    accessToken: authSelectors.getAccessToken(state),
    refreshToken: authSelectors.getRefreshToken(state),
    tokenExpiry: authSelectors.getAccessTokenExpirationTime(state),
  }),
  {
    setPostToSketch: sketchActions.setPostToSketch,
    fromSketchMessage: sketchActions.fromSketchMessage,
    setSketchData: sketchActions.setSketchData,
  },
)(withNavigation(SketchView));
