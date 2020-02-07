import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  StyleSheet,
} from 'react-native';

import ModalSelector from 'react-native-modal-selector';
import { actions as inspectionActions } from 'ducks/inspection';
import { ButtonSmall } from 'components/elements/buttons';
import dimensions from 'styles/dimensions';
import icons from 'resources/icons';
import { ModalSelectorStyles } from 'components/images/ModalStyles';

const styles = StyleSheet.create({
  removeButton: {
    marginHorizontal: dimensions.spacing,
  },
});

const REMOVE_CONFIRMED = 'Remove Section';

interface Method {
  key: string;
  label: string;
}
const METHODS: Method[] = [
  { key: REMOVE_CONFIRMED, label: REMOVE_CONFIRMED },
];

interface OwnProps {
  sectionId: string;
}
interface DispatchProps {
  removeSection: Function;
}
type Props = OwnProps & DispatchProps;

class RemoveSectionButton extends Component<Props> {
  private onMethodSelect(method: string): void {
    if (method === REMOVE_CONFIRMED) {
      this.removeSection();
    }
  }

  private removeSection(): void {
    const {
      removeSection, sectionId,
    } = this.props;
    removeSection(sectionId);
  }

  public render(): JSX.Element {
    return (
      <ModalSelector
        data={METHODS}
        onChange={(method: Method) => this.onMethodSelect(method.key)}
        animationType="fade"
        backdropPressToClose
        {...ModalSelectorStyles}
      >
        <ButtonSmall
          icon={icons.trash}
          style={styles.removeButton}
          onPress={() => this.removeSection()}
        />
      </ModalSelector>
    );
  }
}

const connectedComponent = connect<{}, DispatchProps>(
  (state: any) => ({}),
  (dispatch: Dispatch) => bindActionCreators(
    {
      removeSection: inspectionActions.removeSection,
    },
    dispatch,
  ),
)(RemoveSectionButton);

export default connectedComponent;
