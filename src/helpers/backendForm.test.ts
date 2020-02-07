import * as backendForm from 'helpers/backendForm';
import { BackendFieldDefinition } from 'types/api/backendForm';
import { DEFAULT_FIELD_WIDTH } from 'constants/formWidth';

describe('backend form', () => {
  const textField = {
    id: '17897887',
    name: 'comment',
    fieldType: 'text',
    isRequired: false,
    labelText: 'Interior Comments',
    validators: [
      'text',
    ],
    layout: {
      width: 4,
    },
  };

  const selectField = {
    id: '59189796',
    name: 'bathWainscotInfluence',
    fieldType: 'dropdown',
    isRequired: false,
    labelText: 'Condition',
    validators: [
      'text',
    ],
    options: [
      'New',
      'Good',
      'Average',
      'Fair',
      'Poor',
      'Damaged',
      'Obsolete',
    ],
    valueOptions: [
      'New',
      'Good',
      'Avg',
      'Fair',
      'Poor',
      'Dmgd',
      'Obsolete',
    ],
  };

  const switchField = {
    id: '57762881',
    name: 'other',
    fieldType: 'radio',
    isRequired: false,
    labelText: 'Other',
    validators: [
      'text',
    ],
    options: [
      'Yes',
      'No',
    ],
    valueOptions: [
      'true',
      'false',
    ],
  };

  it('should be switch field', () => {
    expect(backendForm.isSwitch(switchField as BackendFieldDefinition)).toBe(true);
  });

  it('should not be switch field', () => {
    expect(backendForm.isSwitch(textField as BackendFieldDefinition)).toBe(false);
    expect(backendForm.isSwitch(selectField as BackendFieldDefinition)).toBe(false);
  });

  it('should be default width', () => {
    expect(backendForm.getFieldWidth(switchField as BackendFieldDefinition)).toBe(DEFAULT_FIELD_WIDTH);
  });

  it('should be specified width', () => {
    expect(backendForm.getFieldWidth(textField as BackendFieldDefinition)).toBe(4);
  });
});
