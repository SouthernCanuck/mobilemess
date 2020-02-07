import React, { Component } from 'react';
import {
  StyleSheet, View, Image, TextInput,
} from 'react-native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import routeNames from 'constants/routeNames';
import { selectors, actions } from 'ducks/inspection';
import colors from 'styles/colors';
import { ButtonPrimary } from 'components/elements/buttons';
import { LabelBright as Label } from 'components/elements/typography';
import { RowItem } from 'components/elements/containers';
import icons from 'resources/icons';
import dimensions from 'styles/dimensions';
import { getValue, getMultiValuesSize } from 'helpers/multiValues';
import ImageData from 'types/imageData';
import CameraLibrarySelector from 'components/images/CameraLibrarySelector';
import RemoveImageButton from 'components/images/RemoveImageButton';
import ImageLabelSelector from 'components/images/ImageLabelSelector';
import { FormPath, FieldValueMap } from 'types/fieldValue';
import { getFieldDefinitionId, getFieldPathWithDefinitionId, getFieldId } from 'helpers/fieldValue';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  comment: {
    maxWidth: 500,
    marginRight: 'auto',
  },
  closeButton: {
    backgroundColor: colors.inputs.dark,
    marginLeft: dimensions.spacing * 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textInput: {
    height: dimensions.inputHeight,
    marginVertical: dimensions.inputMargin,
    paddingHorizontal: dimensions.inputPadding,
    borderWidth: 0,
    backgroundColor: colors.inputs.dark,
    color: colors.white,
  },
  footer: {
    padding: dimensions.spacing * 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

interface DispatchProps {
  changeValue: Function;
  removeValue: Function;
}
interface OwnProps {
  values: FieldValueMap;
}

type Props = OwnProps & NavigationInjectedProps & DispatchProps;

interface State {
  fieldId: string;
  fieldIndex?: number;
  path: FormPath;
  comments: string;
  originalValue?: ImageData;
  definitionId: string;
}

class ConfirmPictureScreen extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    const { navigation, values } = this.props;
    const fieldId = navigation.getParam('fieldId');
    const fieldIndex = navigation.getParam('fieldIndex');
    const fieldPath = navigation.getParam('fieldPath');
    const definitionId = getFieldDefinitionId(fieldPath);
    const value = getValue(values, fieldId, fieldIndex) as ImageData;
    const comments = (value && value.comments) ? value.comments : '';
    this.state = {
      comments,
      fieldId,
      fieldIndex,
      originalValue: value,
      path: fieldPath,
      definitionId,
    };
  }

  private onChangeLabel(newDefinitionId: string): void {
    this.setState({ definitionId: newDefinitionId });
  }

  private onCommentsChange = (comments: string): void => {
    this.setState({ comments });
  }

  private confirmPicture(): void {
    const {
      navigation, changeValue, removeValue, values,
    } = this.props;
    const {
      fieldId, fieldIndex, comments, originalValue, path, definitionId,
    } = this.state;
    const originalDefinitionId = getFieldDefinitionId(path);
    const base64 = navigation.getParam('base64') || originalValue!.base64;
    if (!originalValue
      || definitionId === originalDefinitionId) {
      // update value
      changeValue(fieldId, fieldIndex, { comments, base64 }, path);
    } else {
      // remove old
      removeValue(fieldId, fieldIndex);
      // add new value
      const newPath = getFieldPathWithDefinitionId(path, definitionId);
      const newFieldId = getFieldId(newPath);
      changeValue(newFieldId, getMultiValuesSize(values, newFieldId), { comments, base64 }, newPath);
    }

    navigation.navigate(routeNames.INSPECTION);
  }

  public render(): JSX.Element {
    const { navigation } = this.props;
    const {
      fieldId, fieldIndex, comments, originalValue, path, definitionId,
    } = this.state;
    const base64 = navigation.getParam('base64') || originalValue!.base64;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          { !!originalValue
            && (
              <RowItem flex={4}>
                <ImageLabelSelector
                  definitionId={definitionId}
                  changeLabel={(newValue: string) => this.onChangeLabel(newValue)}
                />
              </RowItem>
            )
          }
          <RowItem style={styles.comment} flex={4}>
            <Label>Comments</Label>
            <TextInput
              value={comments}
              onChangeText={(newValue: string) => this.onCommentsChange(newValue)}
              style={styles.textInput}
            />
          </RowItem>
          { !!originalValue
              && (
                <RemoveImageButton
                  fieldId={fieldId}
                  fieldIndex={fieldIndex}
                />
              )
          }
        </View>
        <View style={styles.content}>
          <Image
            style={styles.image}
            source={{
              uri: `data:image/png;base64,${base64}`,
            }}
          />
        </View>
        <View style={styles.footer}>
          {!!originalValue
          && (
            <CameraLibrarySelector
              id={fieldId}
              index={fieldIndex}
              path={path}
            >
              <ButtonPrimary
                iconPosition="right"
                title="Retake picture"
              />
            </CameraLibrarySelector>
          )
          }
          <ButtonPrimary
            onPress={() => this.confirmPicture()}
            icon={icons.arrowRight}
            iconPosition="right"
            title={originalValue ? 'Save' : 'Add photo'}
          />
        </View>
      </View>
    );
  }
}

const connectedComponent = connect<{}, DispatchProps>(
  (state: any) => ({
    values: selectors.getValues(state),
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      changeValue: actions.changeValue,
      removeValue: actions.removeValue,
    },
    dispatch,
  ),
)(ConfirmPictureScreen);

export default withNavigation(connectedComponent);
