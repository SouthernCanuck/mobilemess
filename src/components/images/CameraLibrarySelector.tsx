import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import ModalSelector from 'react-native-modal-selector';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

import routeNames from 'constants/routeNames';
import { ModalSelectorStyles } from 'components/images/ModalStyles';
import { compressPhoto } from 'helpers/compressPhoto';
import { FormPath } from 'types/fieldValue';


interface OwnProps {
  id: string;
  index?: number;
  path: FormPath;
}

type Props = OwnProps & NavigationInjectedProps;

const UPLOAD_FROM_LIBRARY = 'Upload from library';
const OPEN_DEVICE_CAMERA = 'Open device camera';

interface Method {
  key: string;
  label: string;
}
const METHODS: Method[] = [
  { key: UPLOAD_FROM_LIBRARY, label: UPLOAD_FROM_LIBRARY },
  { key: OPEN_DEVICE_CAMERA, label: OPEN_DEVICE_CAMERA },
];

const initializeCamera = async (): Promise<void> => {
  const [camera, cameraRoll] = await Promise.all([
    Permissions.askAsync(Permissions.CAMERA),
    Permissions.askAsync(Permissions.CAMERA_ROLL),
  ]);

  if (camera.status !== 'granted'
    || cameraRoll.status !== 'granted') {
    console.info('No camera/roll permissions for ');
  }
};

class CameraLibrarySelector extends Component<Props> {
  public componentDidMount(): void {
    // camera initialization should be done here
    initializeCamera();
  }

  private async onMethodSelect(method: string): Promise<void> {
    const {
      id, index, navigation, path,
    } = this.props;
    if (method === UPLOAD_FROM_LIBRARY) {
      navigation.navigate(
        routeNames.PICTURE_SELECT,
        {
          fieldId: id,
          fieldIndex: index,
          fieldPath: path,
        },
      );
    } else if (method === OPEN_DEVICE_CAMERA) {
      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      // ImagePickerResult type definition doesn't include property `uri` even though it is there
      const {
        cancelled, uri, width, height,
      } = cameraResult as any;
      if (cancelled) {
        return;
      }

      const base64 = await compressPhoto(uri, width, height);
      navigation.navigate(
        routeNames.CONFIRM_PICTURE,
        {
          fieldId: id,
          fieldIndex: index,
          fieldPath: path,
          base64,
        },
      );
    }
  }

  public render(): JSX.Element {
    const {
      children,
    } = this.props;

    return (
      <ModalSelector
        data={METHODS}
        onChange={(method: Method) => this.onMethodSelect(method.key)}
        animationType="fade"
        backdropPressToClose
        {...ModalSelectorStyles}
      >
        {children}
      </ModalSelector>
    );
  }
}

export default withNavigation(CameraLibrarySelector);
