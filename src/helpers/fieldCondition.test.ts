import * as fieldConditions from 'helpers/fieldConditions';
import {
  BackendFieldDefinition,
  BackendFieldConditionRule,
  BackendFieldMap,
  BackendFieldCondition,
} from 'types/api/backendForm';
import { FieldValueMap, FormPath } from 'types/fieldValue';
import { getFieldId } from 'helpers/fieldValue';

describe('field conditions', () => {
  const textField1 = {
    id: 'textField1',
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
  const path1: FormPath = [{ id: 'textField1' }];

  const textField2 = {
    id: 'textField2',
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
  const path2: FormPath = [{ id: 'textField2' }];

  const dictionary: BackendFieldMap = {
    textField1: { ...textField1 },
    textField2: { ...textField2 },
  };

  const id1 = getFieldId(path1);
  const id2 = getFieldId(path2);

  const values: FieldValueMap = {
    [id1]: {
      id: id1,
      dataValue: 'value1',
      path: path1,
    },
    [id2]: {
      id: id2,
      dataValue: 'value2',
      path: path2,
    },
  };


  it('should pass string condition with same value', () => {
    const condition: BackendFieldConditionRule = {
      id: 'textField1',
      condition: BackendFieldCondition.EQ,
      values: ['value'],
    };

    expect(fieldConditions.checkConditionForString(condition, 'value'))
      .toBe(true);
  });

  it('should not pass string condition with different value', () => {
    const condition: BackendFieldConditionRule = {
      id: 'textField1',
      condition: BackendFieldCondition.EQ,
      values: ['value'],
    };

    expect(fieldConditions.checkConditionForString(condition, 'otherValue'))
      .toBe(false);
  });

  it('should pass string condition with second value', () => {
    const condition: BackendFieldConditionRule = {
      id: 'textField1',
      condition: BackendFieldCondition.EQ,
      values: ['value', 'value1', 'value2'],
    };

    expect(fieldConditions.checkConditionForString(condition, 'value1'))
      .toBe(true);
  });

  it('should pass array condition', () => {
    const condition: BackendFieldConditionRule = {
      id: 'textField1',
      condition: BackendFieldCondition.EQ,
      values: ['value', 'value1', 'value2'],
    };

    expect(fieldConditions.checkConditionForArray(condition, ['otherValue1', 'value2']))
      .toBe(true);
  });

  it('should not pass array condition', () => {
    const condition: BackendFieldConditionRule = {
      id: 'textField1',
      condition: BackendFieldCondition.EQ,
      values: ['value', 'value1', 'value2'],
    };

    expect(fieldConditions.checkConditionForArray(condition, ['otherValue1', 'otherValue2']))
      .toBe(false);
  });

  it('should be visible if no any values', () => {
    expect(fieldConditions.isVisible({}, dictionary, path1))
      .toBe(true);
  });

  it('should be visible if no any conditions', () => {
    expect(fieldConditions.isVisible(values, dictionary, path1))
      .toBe(true);
  });

  it('should not pass condition', () => {
    const condition = {
      id: 'textField1',
      values: [
        'otherValue',
      ],
      condition: BackendFieldCondition.EQ,
    };
    expect(fieldConditions.checkCondition(values, dictionary, path2, condition))
      .toBe(false);
  });

  it('should pass condition', () => {
    const condition = {
      id: 'textField1',
      values: [
        'value1',
      ],
      condition: BackendFieldCondition.EQ,
    };
    expect(fieldConditions.checkCondition(values, dictionary, path2, condition))
      .toBe(true);
  });

  it('should be hidden if condition is not passed', () => {
    const dictionary2 = {
      ...dictionary,
      textField2: {
        ...textField2,
        requiredby: [
          {
            id: 'textField1',
            values: [
              'otherValue',
            ],
            condition: BackendFieldCondition.EQ,
          },
        ],
      },
    };
    expect(fieldConditions.isVisible(values, dictionary2, path2))
      .toBe(false);
  });

  it('should be visible if condition is passed', () => {
    const dictionary2 = {
      ...dictionary,
      textField2: {
        ...textField2,
        requiredby: [
          {
            id: 'textField1',
            values: [
              'value1',
            ],
            condition: BackendFieldCondition.EQ,
          },
        ],
      },
    };
    expect(fieldConditions.isVisible(values, dictionary2, path2))
      .toBe(true);
  });
});
