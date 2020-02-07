import backendFieldMap from 'helpers/formScript/backendFieldMap.json';
import fieldsBySection from 'helpers/formScript/fieldsBySection.json';
import {
  BackendFieldMap, BackendFieldDefinition, BackendFieldDataType, BackendFieldValidator, BackendFieldType,
} from 'types/api/backendForm';
import { BackendSectionList } from 'types/api/backendSection';
import { DEFAULT_FIELD_WIDTH } from 'constants/formWidth';

export const getDictionary = (): BackendFieldMap => backendFieldMap as BackendFieldMap;
export const getFieldsBySection = (): BackendSectionList => fieldsBySection as BackendSectionList;

export const isObject = (config: BackendFieldDefinition): boolean => (
  (config.fieldType === BackendFieldType.Object)
);

export const isArray = (config: BackendFieldDefinition): boolean => (
  (config.fieldType === BackendFieldType.Array)
);

export const isSwitch = (config: BackendFieldDefinition): boolean => (
  (config.dataType === BackendFieldDataType.Boolean)
  || (config.options?.length === 2)
);

export const isRadio = (config: BackendFieldDefinition): boolean => (
  (config?.options?.length !== undefined) && (config.options.length < 5)
);

export const isNumeric = (config: BackendFieldDefinition): boolean => (
  config.dataType === BackendFieldDataType.Integer
);

export const isCurrency = (config: BackendFieldDefinition): boolean => (
  (config.validators && config.validators[0]) ? config.validators[0] === BackendFieldValidator.Positive
    : false
);

export const isNumericSelect = (config: BackendFieldDefinition): boolean => (
  (config.fieldType === BackendFieldType.Numeric)
  && (config.options !== undefined)
);

export const getSectionPhotoId = (sectionId: string): string => {
  const dictionary = getDictionary();
  const sectionPhotoField = Object.values(dictionary)
    .find((fieldDefinition) => (
      fieldDefinition.photoType === sectionId
    ));

  return sectionPhotoField ? sectionPhotoField.id : '';
};

export const getFieldWidth = (config: BackendFieldDefinition): number => config.layout?.width ?? DEFAULT_FIELD_WIDTH;
