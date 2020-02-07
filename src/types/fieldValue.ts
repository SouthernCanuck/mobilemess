import ImageData from 'types/imageData';

export type SingleFieldDataValue =
  undefined |
  null |
  string |
  ImageData;

export type MultiFieldDataValue = SingleFieldDataValue[];

export type FieldDataValue = SingleFieldDataValue | MultiFieldDataValue;

export interface FormPathItem {
  id: string;
  index?: number;
}

export type FormPath = FormPathItem[];

export interface FieldValue {
  id: string;
  path: FormPath;
  dataValue: FieldDataValue;
}

export type FieldValueMap = { [fieldId: string]: FieldValue };

export const ROOT = 'root';
