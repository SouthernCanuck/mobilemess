import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

const compressionRate = 0.3; // 0 .. 1.0, 1 means no compression

const maxPhotoWidth = 500;
const maxPhotoHeight = 500;

export const compressPhoto = async (uri: string, width: number, height: number): Promise<string> => {
  let imageWidth;
  let imageHeight;

  if (width > height) {
    imageWidth = Math.min(maxPhotoWidth, width);
    const ratio = imageWidth / width;
    imageHeight = height * ratio;
  } else {
    imageHeight = Math.min(maxPhotoHeight, height);
    const ratio = imageHeight / height;
    imageWidth = width * ratio;
  }

  const compressedPhoto = await manipulateAsync(
    uri,
    [{ resize: { width: imageWidth, height: imageHeight } }],
    { compress: compressionRate, format: SaveFormat.PNG, base64: true },
  );

  return compressedPhoto.base64 as string;
};
