
import {
  FieldValue,
  FieldValueMap,
  FieldDataValue,
  MultiFieldDataValue,
  SingleFieldDataValue,
  FormPath,
} from 'types/fieldValue';

export const getMultiValuesSize = (
  values: FieldValueMap,
  id: string,
): number => {
  const fieldValue = values[id];
  if (!fieldValue) {
    return 0;
  }

  const valuesArray = fieldValue.dataValue as MultiFieldDataValue;
  const size = (valuesArray && valuesArray.length) ? valuesArray.length : 0;
  return size;
};

export const getOneOrAllIndexes = (
  values: FieldValueMap,
  id: string,
): number[] => {
  const size = getMultiValuesSize(values, id) + 1;
  return Array.from(Array(size)).map((arg: number, index: number) => index);
};

export const getValue = (
  values: FieldValueMap,
  id: string,
  index?: number,
): FieldDataValue => {
  const fieldValue = values[id];
  if (!fieldValue) {
    return undefined;
  }

  if (index === undefined) {
    return fieldValue.dataValue;
  }

  const valuesArray = fieldValue.dataValue as MultiFieldDataValue;
  if (!valuesArray
      || !valuesArray.length
      || index >= valuesArray.length) {
    return undefined;
  }

  return valuesArray[index];
};

export const getPath = (
  values: FieldValueMap,
  id: string,
  index?: number,
): FormPath => {
  const fieldValue = values[id];
  if (!fieldValue) {
    return [];
  }

  return fieldValue.path;
};

export const setValue = (
  values: FieldValueMap,
  path: FormPath,
  value: SingleFieldDataValue,
  id: string,
  index?: number,
): FieldValueMap => {
  if (index === undefined) {
    const fieldValue: FieldValue = {
      id,
      path,
      dataValue: value,
    };
    return {
      ...values,
      [id]: fieldValue,
    };
  }

  let fieldValue = values[id];
  if (!fieldValue) {
    fieldValue = {
      id,
      path,
      dataValue: [],
    };
  } else {
    fieldValue = { ...fieldValue };
  }


  let valuesArray = fieldValue.dataValue as MultiFieldDataValue;
  if (!valuesArray
      || !valuesArray.length) {
    valuesArray = [value];
  } else {
    valuesArray = [...valuesArray];
  }

  if (index >= valuesArray.length) {
    valuesArray.push(value);
  } else {
    valuesArray[index] = value;
  }
  fieldValue.dataValue = valuesArray;

  return {
    ...values,
    [id]: fieldValue,
  };
};

export const removeValue = (
  values: FieldValueMap,
  id: string,
  index?: number,
): FieldValueMap => {
  if (index === undefined) {
    const { [id]: value, ...valuesWithoutField } = values;
    return valuesWithoutField;
  }

  const fieldValue = values[id];
  if (!fieldValue) {
    return values;
  }

  let valuesArray = values[id].dataValue as MultiFieldDataValue;
  if (!valuesArray
    || !valuesArray.length) {
    // it is ok values are removed
    return values;
  }
  valuesArray = [...valuesArray];


  if (index >= valuesArray.length) {
    // we already removed that value
    return values;
  }

  valuesArray.splice(index, 1);

  return {
    ...values,
    [id]: {
      ...fieldValue,
      dataValue: valuesArray,
    },
  };
};
