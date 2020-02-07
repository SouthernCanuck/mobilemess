import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
} from 'react-native';
import Select from 'components/forms/SelectFieldWhite';

import ModalSelector from 'react-native-modal-selector';
import { ModalSelectorStyles } from 'components/images/ModalStyles';
import { BackendFieldMap } from 'types/api/backendForm';
import { getDictionary } from 'helpers/backendForm';
import { getSectionLabels } from 'helpers/imageLabels';
import { isIOS } from 'helpers/platform';

const CHANGE_CONFIRMED = 'Change Image Label';

interface Method {
  key: string;
  label: string;
}
const METHODS: Method[] = [
  { key: CHANGE_CONFIRMED, label: CHANGE_CONFIRMED },
];

interface OwnProps {
  definitionId: string;
  changeLabel: Function;
}

interface StateProps {
  changedDefinitionId: string;
  showConfirmationDialog: boolean;
}

interface ExternalProps {
  dictionary: BackendFieldMap;
}

type Props = OwnProps & ExternalProps;


class ImageLabelSelector extends Component<Props, StateProps> {
  public constructor(props: Props) {
    super(props);
    const { definitionId } = this.props;
    this.state = {
      changedDefinitionId: definitionId,
      showConfirmationDialog: false,
    };
  }

  private onSectionSelect(newDefinitionId: string): void {
    const { showConfirmationDialog } = this.state;
    if (showConfirmationDialog) {
      return;
    }

    this.setState({
      changedDefinitionId: newDefinitionId,
      showConfirmationDialog: !isIOS(),
    });
  }

  private onSelectionFinished(): void {
    if (isIOS()) {
      const { definitionId } = this.props;
      const { changedDefinitionId } = this.state;
      if (definitionId !== changedDefinitionId) {
        this.setState({
          showConfirmationDialog: true,
        });
      }
    }
  }

  private onCloseDialog(): void {
    this.setState({
      showConfirmationDialog: false,
    });
  }

  private onMethodSelect(method: string): void {
    const {
      changedDefinitionId,
    } = this.state;

    const { changeLabel } = this.props;
    if (method === CHANGE_CONFIRMED) {
      changeLabel(changedDefinitionId);
    }

    this.setState({
      showConfirmationDialog: false,
    });
  }

  public render(): JSX.Element {
    const { definitionId, dictionary } = this.props;
    const field = dictionary[definitionId];
    const { changedDefinitionId, showConfirmationDialog } = this.state;

    const dropdownOptions = getSectionLabels(dictionary, field.section!)
      .map(label => ({ label: label.name, value: label.id }));
    return (
      <>
        <Select
          value={!showConfirmationDialog && isIOS() ? changedDefinitionId : definitionId}
          items={dropdownOptions}
          onDonePress={() => this.onSelectionFinished()}
          label="Select section"
          placeholder={{}}
          onChange={(newValue: string) => this.onSectionSelect(newValue)}
        />

        <ModalSelector
          data={METHODS}
          onChange={(method: Method) => this.onMethodSelect(method.key)}
          onModalClose={() => this.onCloseDialog()}
          animationType="fade"
          backdropPressToClose
          {...ModalSelectorStyles}
          visible={showConfirmationDialog}
        >
          <View />
        </ModalSelector>
      </>
    );
  }
}

export default connect<ExternalProps>(
  (state: any) => ({
    dictionary: getDictionary(),
  }),
)(ImageLabelSelector);
