import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import {
  StyleSheet, View, TouchableOpacity, FlatList, Image, Dimensions,
} from 'react-native';
import { compressPhoto } from 'helpers/compressPhoto';

// 17.12.2019 CameraRoll removed from react-native
// we moved to MediaLibrary by suggestion here:
// https://github.com/react-native-community/react-native-cameraroll/issues/113
import * as MediaLibrary from 'expo-media-library';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import routeNames from 'constants/routeNames';
import { selectors, actions } from 'ducks/inspection';

interface StateProps {
  selectingFor: any;
}
interface DispatchProps {
  hide: Function;
}
type Props = StateProps & DispatchProps & NavigationInjectedProps;

interface State {
  photos: MediaLibrary.Asset[];
  endCursor?: string;
  loadedAll: boolean;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

class PictureList extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      photos: [],
      endCursor: undefined,
      loadedAll: false,
    };
  }

  public componentDidMount(): void {
    this.initializePhotos();
  }

  private async onPictureSelect(uri: string, width: number, height: number): Promise<void> {
    const { navigation } = this.props;
    const fieldId = navigation.getParam('fieldId');
    const fieldIndex = navigation.getParam('fieldIndex');
    const fieldPath = navigation.getParam('fieldPath');
    const base64 = await compressPhoto(uri, width, height);

    navigation.navigate(
      routeNames.CONFIRM_PICTURE,
      {
        fieldId,
        fieldIndex,
        fieldPath,
        base64,
      },
    );
  }

  private async initializePhotos(): Promise<void> {
    const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== 'granted') {
      return;
    }

    this.loadMorePictures();
  }

  private async loadMorePictures(): Promise<void> {
    const { photos, loadedAll, endCursor } = this.state;

    if (loadedAll) {
      return;
    }

    const result = await MediaLibrary.getAssetsAsync({
      first: 27,
      after: endCursor,
      mediaType: [MediaLibrary.MediaType.photo],
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });

    if (!result
      || !result.assets) {
      console.debug('no photos');
      return;
    }

    this.setState({
      photos: photos.concat(result.assets),
      endCursor: result.endCursor,
      loadedAll: !result.hasNextPage,
    });
  }

  public render(): JSX.Element {
    const imageWidth = Dimensions.get('screen').width / 3;
    const { photos } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          numColumns={3}
          onEndReached={() => this.loadMorePictures()}
          data={photos}
          renderItem={({ item }: { item: MediaLibrary.Asset }) => {
            const { uri, width, height } = item;
            return (
              <TouchableOpacity
                onPress={() => this.onPictureSelect(uri, width, height)}
                key={uri}
              >
                <Image
                  style={{ width: imageWidth, height: imageWidth }}
                  source={{ uri }}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={p => p.id}
          removeClippedSubviews
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          updateCellsBatchingPeriod={100}
          windowSize={7}
        />
      </View>
    );
  }
}

export default withNavigation(connect<StateProps, DispatchProps>(
  (state: any) => ({
    selectingFor: selectors.getSelectingPictureFor(state),
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      hide: actions.hidePictureList,
    },
    dispatch,
  ),
)(PictureList));
