import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  BackendFieldMap, BackendFieldType,
} from 'types/api/backendForm';
import {
  getDictionary, isNumericSelect,
} from 'helpers/backendForm';
import { selectors as inspectionSelectors } from 'ducks/inspection';

import RadioField from 'components/forms/RadioField';
import SwitchField from 'components/forms/SwitchField';
import TextField from 'components/forms/TextField';
import SelectField from 'components/forms/SelectField';
import MultiSelectField from 'components/forms/MultiSelectField';
import ImageArray from 'components/forms/ImageArray';
import DateTimeField from 'components/forms/DateTimeField';
import { FormPath, FieldValueMap } from 'types/fieldValue';

import { getFieldDefinitionId, getFieldId } from 'helpers/fieldValue';
import { isVisible } from 'helpers/fieldConditions';


interface OwnProps {
  index? : number;
  path: FormPath;
}

interface StateProps {
  dictionary: BackendFieldMap;
  values: FieldValueMap;
}

type Props = OwnProps & StateProps;

class GeneratedProperty extends Component<Props> {
  public render(): JSX.Element | null {
    const {
      dictionary, index, path, values,
    } = this.props;

    const definitionId = getFieldDefinitionId(path);
    const id = getFieldId(path);
    const fieldDefinition = dictionary[definitionId];
    const visible = isVisible(values, dictionary, path);
    if (!visible) {
      return null;
    }
    let renderedProperty;
    switch (fieldDefinition.fieldType) {
      case BackendFieldType.DateTime:
        renderedProperty = (
          <DateTimeField
            id={id}
            index={index}
            path={path}
          />
        );
        break;

      case BackendFieldType.Dropdown:
        renderedProperty = (
          <SelectField
            id={id}
            index={index}
            path={path}
          />
        );
        break;

      case BackendFieldType.Radio:
        renderedProperty = (
          <RadioField
            id={id}
            index={index}
            path={path}
          />
        );
        break;

      case BackendFieldType.Multiselect:
        renderedProperty = (
          <MultiSelectField
            id={id}
            index={index}
            path={path}
          />
        );
        break;

      case BackendFieldType.Numeric:
        if (isNumericSelect(fieldDefinition)) {
          renderedProperty = (
            <SelectField
              id={id}
              index={index}
              path={path}
            />
          );
        } else {
          renderedProperty = (
            <TextField
              id={id}
              index={index}
              path={path}
            />
          );
        }
        break;

      case BackendFieldType.Checkbox:
        renderedProperty = (
          <SwitchField
            id={id}
            index={index}
            path={path}
          />
        );
        break;

      case BackendFieldType.Textarea:
      case BackendFieldType.Text:
        renderedProperty = (
          <TextField
            id={id}
            index={index}
            path={path}
          />
        );
        break;

      case BackendFieldType.Photo:
        renderedProperty = (
          <ImageArray
            id={id}
            index={index}
            path={path}
          />
        );
        break;

      default:
        renderedProperty = null;
        console.debug('Type is not supported', fieldDefinition.fieldType);
        break;
    }

    return renderedProperty;
  }
}

export default connect<StateProps>(
  (state: any) => ({
    dictionary: getDictionary(),
    values: inspectionSelectors.getValues(state),
  }),
)(GeneratedProperty);
