import * as multiValues from 'helpers/multiValues';
import { FieldValueMap, MultiFieldDataValue } from 'types/fieldValue';

describe('multi values', () => {
  it('should get multi values size', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };

    const size = multiValues.getMultiValuesSize(values, 'id1');
    expect(size).toBe(3);
  });

  it('should get one index for empty values', () => {
    const values = {};

    const indexes = multiValues.getOneOrAllIndexes(values, 'id1');
    expect(indexes).toEqual([0]);
  });

  it('should get two indexes for one value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1'],
      },
    };

    const indexes = multiValues.getOneOrAllIndexes(values, 'id1');
    expect(indexes).toEqual([0, 1]);
  });

  it('should get real string value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: 'value1',
      },
    };
    expect(multiValues.getValue(values, 'id1')).toBe('value1');
  });

  it('should not get string value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: 'value1',
      },
    };
    expect(multiValues.getValue(values, 'id2')).toBeUndefined();
  });

  it('should get array', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };
    expect(multiValues.getValue(values, 'id1')).toBe(values.id1.dataValue);
  });

  it('should get array element', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };
    expect(multiValues.getValue(values, 'id1', 1)).toBe('value2');
  });

  it('should not get array element', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };
    expect(multiValues.getValue(values, 'id1', 5)).toBeUndefined();
  });

  it('should not get empty array element', () => {
    const values = {
    };
    expect(multiValues.getValue(values, 'id1', 5)).toBeUndefined();
  });

  it('should set string value', () => {
    const values = {};

    const newValues = multiValues.setValue(values, [], 'value1', 'id1');
    expect(newValues.id1.dataValue).toBe('value1');
  });

  it('should set array value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };

    const newValues = multiValues.setValue(values, [], 'value5', 'id1', 1);
    const arrayValues = newValues.id1.dataValue as MultiFieldDataValue;
    expect(arrayValues[1]).toBe('value5');
  });

  it('should add new value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };

    const newValues = multiValues.setValue(values, [], 'value5', 'id1', 3);
    expect((newValues.id1.dataValue as MultiFieldDataValue)[3]).toBe('value5');
  });

  it('should remove value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: 'value1',
      },
    };

    const newValues = multiValues.removeValue(values, 'id1');
    expect(newValues.id1).toBeUndefined();
  });

  it('should remove middle value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };

    const newValues = multiValues.removeValue(values, 'id1', 1);
    expect(newValues.id1.dataValue).toEqual(['value1', 'value3']);
  });

  it('should not remove out-of-index value', () => {
    const values: FieldValueMap = {
      id1: {
        id: '',
        path: [],
        dataValue: ['value1', 'value2', 'value3'],
      },
    };

    const newValues = multiValues.removeValue(values, 'id1', 10);
    expect(newValues.id1).toEqual(values.id1);
  });
});
