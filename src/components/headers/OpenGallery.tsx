import React, { Component } from 'react';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

import routeNames from 'constants/routeNames';
import { ButtonPrimary } from 'components/elements/buttons';
import { StyleSheet } from 'react-native';
import dimensions from 'styles/dimensions';

const styles = StyleSheet.create({
  button: {
    marginHorizontal: dimensions.spacing,
  },
});

class OpenGallery extends Component<NavigationInjectedProps> {
  private onOpenGallery = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.GALLERY);
  }

  public render(): JSX.Element {
    return (
      <ButtonPrimary
        inverted
        title="Gallery"
        onPress={this.onOpenGallery}
        style={styles.button}
      />
    );
  }
}

export default withNavigation(OpenGallery);
