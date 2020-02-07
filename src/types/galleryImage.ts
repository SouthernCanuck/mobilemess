import ImageData from 'types/imageData';
import { FormPath } from 'types/fieldValue';

export interface GalleryImage {
  id: string;
  index?: number;
  value: ImageData;
  path: FormPath;
  sectionId: string;
  labelText: string;
}

export default GalleryImage;
