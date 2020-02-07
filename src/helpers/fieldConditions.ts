import { FormPath, FieldValueMap } from 'types/fieldValue';
import {
  BackendFieldMap, BackendFieldConditionRule, BackendFieldCondition, BackendFieldType,
} from 'types/api/backendForm';
import { getFieldDefinitionId, getFieldId, getFieldPathWithDefinitionId } from 'helpers/fieldValue';
import { getValue } from 'helpers/multiValues';


export const checkConditionForString = (
  condition: BackendFieldConditionRule,
  singleValue: string,
): boolean => {
  switch (condition.condition) {
    case BackendFieldCondition.EQ:
      if (condition.values.includes(singleValue)) {
        return true;
      }
      break;

    default:
      return false;
  }

  return false;
};


export const checkConditionForArray = (
  condition: BackendFieldConditionRule,
  valuesArray: string[],
): boolean => {
  // value is array of strings
  switch (condition.condition) {
    case BackendFieldCondition.EQ:
      if (valuesArray.find(v => condition.values.includes(v))) {
        return true;
      }
      break;

    default:
      return false;
  }

  return false;
};

export const checkCondition = (
  values: FieldValueMap,
  dictionary: BackendFieldMap,
  path: FormPath,
  condition: BackendFieldConditionRule,
): boolean => {
  const conditionFieldPath = getFieldPathWithDefinitionId(path, condition.id);
  const conditionFieldId = getFieldId(conditionFieldPath);
  const value = getValue(values, conditionFieldId);
  if (!value) {
    return false;
  }
  const conditionField = dictionary[condition.id];
  if (conditionField.fieldType === BackendFieldType.Multiselect) {
    return checkConditionForArray(condition, value as string[]);
  }

  return checkConditionForString(condition, value as string);
};


export const isVisible = (values: FieldValueMap, dictionary: BackendFieldMap, path: FormPath): boolean => {
  const definitionId = getFieldDefinitionId(path);
  const field = dictionary[definitionId];
  if (!field.requiredby) {
    return true;
  }

  const falseCondition = field.requiredby.find(condition => !checkCondition(
    values,
    dictionary,
    path,
    condition,
  ));
  if (falseCondition) {
    return false;
  }

  return true;
};
