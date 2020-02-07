import GalleryImage from 'types/galleryImage';
import ImageData from 'types/imageData';
import { BackendFieldType, BackendFieldMap } from 'types/api/backendForm';
import { FieldValueMap } from 'types/fieldValue';
import { getFieldDefinitionId } from 'helpers/fieldValue';


export const getImages = (values: FieldValueMap, dictionary: BackendFieldMap): GalleryImage[] => {
  const imagesArray: GalleryImage[] = [];
  Object.values(values).forEach((value) => {
    const definitionId = getFieldDefinitionId(value.path);
    const field = dictionary[definitionId];
    if (field.fieldType === BackendFieldType.Photo) {
      const dataValue = value.dataValue as ImageData[];
      dataValue.forEach((arrayValue: ImageData, index: number) => {
        imagesArray.push({
          id: value.id,
          index,
          value: arrayValue,
          path: value.path,
          sectionId: field.section!,
          labelText: field.labelText!,
        });
      });
    }
  });

  return imagesArray;
};

export const filterImagesBySection = (
  images: GalleryImage[],
  sectionId: string,
): GalleryImage[] => (
  images.filter((image) => image.sectionId === sectionId)
);
