import React from 'react';
import {
  Image, StyleSheet, TouchableOpacity, View,
} from 'react-native';

import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { SvgXml } from 'react-native-svg';

import routeNames from 'constants/routeNames';
import { getValue } from 'helpers/multiValues';
import icons from 'resources/icons';
import dimensions from 'styles/dimensions';
import colors from 'styles/colors';
import CameraLibrarySelector from 'components/images/CameraLibrarySelector';
import { FieldValueMap, FormPath } from 'types/fieldValue';
import ImageData from 'types/imageData';

const size = 138;

const styles = StyleSheet.create({
  container: {
    marginRight: dimensions.spacing,
  },
  imageBorder: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: size,
    width: size,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius,
    borderWidth: 1,
  },
});

interface OwnProps {
  id: string;
  values: FieldValueMap;
  index?: number;
  path: FormPath;
}

type Props = OwnProps & NavigationInjectedProps;


class ImageField extends React.Component<Props> {
  private onViewDetail = (): void => {
    const {
      id, index, navigation, path,
    } = this.props;
    navigation.navigate(
      routeNames.CONFIRM_PICTURE,
      {
        fieldId: id,
        fieldIndex: index,
        fieldPath: path,
      },
    );
  }

  render = (): JSX.Element => {
    const {
      id, index, values, path,
    } = this.props;
    const value = getValue(values, id, index) as ImageData;

    const imageComponent = (
      <View style={styles.imageBorder}>
        {value ? (
          <Image
            style={{
              width: size,
              height: size,
            }}
            source={{
              uri: `data:image/png;base64,${value.base64}`,
            }}
          />
        ) : (
          <SvgXml width={32} height={32} xml={icons.camera} />
        )}
      </View>
    );

    if (value) {
      return (
        <TouchableOpacity
          onPress={this.onViewDetail}
        >
          {imageComponent}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.container}>
        <CameraLibrarySelector
          id={id}
          index={index}
          path={path}
        >
          {imageComponent}
        </CameraLibrarySelector>
      </View>
    );
  };
}

export default withNavigation(ImageField);
