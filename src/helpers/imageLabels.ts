import {
  BackendFieldType, BackendFieldMap, BackendFieldArray, BackendFieldDefinition,
} from 'types/api/backendForm';
import { ImageLabelList } from 'types/labelType';

export const getImagesDefinitions = (dictionary: BackendFieldMap): BackendFieldArray => Object
  .values(dictionary)
  .filter((field) => field.fieldType === BackendFieldType.Photo);

export const isSectionImage = (field: BackendFieldDefinition): boolean => field.photoType === field.section;

export const getImagesLabels = (dictionary: BackendFieldMap): ImageLabelList => {
  const images = getImagesDefinitions(dictionary);

  return images.map(field => ({
    id: field.id,
    name: field.photoCaption!,
    sectionId: field.section!,
  }));
};

export const getSectionLabels = (dictionary: BackendFieldMap, sectionId: string): ImageLabelList => {
  const labels = getImagesLabels(dictionary);
  return labels.filter(label => label.sectionId === sectionId);
};
