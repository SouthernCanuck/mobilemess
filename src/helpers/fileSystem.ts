import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export const saveJsonFile = async (fileName: string, content: object): Promise<void> => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== 'granted') {
    console.debug('Cannot save file, no permissions');
    return;
  }

  const fileUri = FileSystem.documentDirectory + fileName;
  await FileSystem.writeAsStringAsync(
    fileUri,
    JSON.stringify(content),
    { encoding: FileSystem.EncodingType.UTF8 },
  );
};

export const loadJsonFile = async (fileName: string): Promise<object | null> => {
  const filename = FileSystem.documentDirectory + fileName;

  try {
    const fileRaw = await FileSystem.readAsStringAsync(
      filename,
      { encoding: FileSystem.EncodingType.UTF8 },
    );

    try {
      return JSON.parse(fileRaw);
    } catch (e) {
      console.debug('Cannot parse file', e);
    }
  } catch (e) {
    console.debug('Cannot find file', e);
  }

  return null;
};
