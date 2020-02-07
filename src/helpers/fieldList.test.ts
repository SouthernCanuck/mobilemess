import * as fieldList from 'helpers/fieldList';
import { BackendFieldDefinition, BackendFieldType, BackendFieldMap } from 'types/api/backendForm';

import { FrontendSectionDefinition, InspectionSection } from 'types/fieldsSection';

describe('field list', () => {
  const textField = {
    id: 'textField',
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
  } as BackendFieldDefinition;

  const dictionary: BackendFieldMap = {
    textField1: { ...textField, layout: { width: 1 } },
    textField3: { ...textField, layout: { width: 3 } },
    textField4: { ...textField, layout: { width: 4 } },
    textField6: { ...textField, layout: { width: 6 } },
    textField12: { ...textField, layout: { width: 12 } },
    object1: {
      ...textField,
      fieldType: BackendFieldType.Object,
      properties: [
        { id: 'textField1', name: '' },
        { id: 'textField3', name: '' },
        { id: 'textField4', name: '' },
        { id: 'textField6', name: '' },
        { id: 'textField12', name: '' },
      ],
    },
  };

  it('should get plain list from plain list', () => {
    const sectionDefinition: InspectionSection = {
      sectionId: '',
      properties: [
        { id: 'textField1' },
        { id: 'textField3' },
        { id: 'textField4' },
        { id: 'textField6' },
        { id: 'textField12' },
      ],
      index: 0,
      canAdd: true,
      canRemove: true,
    };

    const section = fieldList.getFieldList(sectionDefinition, dictionary);
    expect(section.properties.map(item => item.id))
      .toEqual([
        'textField1',
        'textField3',
        'textField4',
        'textField6',
        'textField12',
      ]);
  });

  it('should get plain list from tree', () => {
    const sectionDefinition: InspectionSection = {
      sectionId: '',
      properties: [
        { id: 'textField1' },
        { id: 'textField3' },
        { id: 'object1' },
        { id: 'textField4' },
        { id: 'textField6' },
        { id: 'textField12' },
      ],
      index: 0,
      canAdd: true,
      canRemove: true,
    };

    const section = fieldList.getFieldList(sectionDefinition, dictionary);
    expect(section.properties.map(item => item.id))
      .toEqual([
        'textField1',
        'textField3',
        'textField1',
        'textField3',
        'textField4',
        'textField6',
        'textField12',
        'textField4',
        'textField6',
        'textField12',
      ]);
  });

  it('should get 3 rows', () => {
    const section: FrontendSectionDefinition = {
      sectionId: '',
      properties: [
        { id: 'textField1', path: [], width: 1 },
        { id: 'textField3', path: [], width: 3 },
        { id: 'textField4', path: [], width: 4 },
        { id: 'textField6', path: [], width: 6 },
        { id: 'textField12', path: [], width: 12 },
      ],
    };

    const rows = fieldList.getFieldsByRow(section);
    expect(rows.map(row => row.map(item => item.id)))
      .toEqual([
        [
          'textField1',
          'textField3',
          'textField4',
        ],
        [
          'textField6',
        ],
        [
          'textField12',
        ],
      ]);
  });
});
