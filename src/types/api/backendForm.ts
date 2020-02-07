export interface BackendFieldLayout {
  width?: number;
}

export enum BackendFieldCondition {
  EQ = 'equal',
  NOT_EQ = 'not equal',
  NOT_EMPTY = 'not empty'
}

export interface BackendFieldConditionRule {
  id: string;
  values: string[];
  condition: string;
}

export interface BackendFieldDefinition {
  id: string;
  name?: string;
  fieldType: BackendFieldType;
  properties?: BackendFieldItem[];
  photos?: string[];
  isRequired?: boolean;
  labelText?: string;
  photoCaption?: string;
  photoType?: string;
  validators?: BackendFieldValidator[];
  options?: string[];
  valueOptions?: string[];
  dataType?: BackendFieldDataType;
  requiredby?: BackendFieldConditionRule[];
  items?: BackendFieldItem[];
  comment?: string;
  minLength?: number;
  maxLength?: number;
  isHidden?: boolean;
  layout?: BackendFieldLayout;
  section?: string;
}

export enum BackendFieldDataType {
  Boolean = 'boolean',
  Integer = 'integer',
  String = 'string',
}

export enum BackendFieldType {
  Array = 'array',
  Dropdown = 'dropdown',
  Object = 'object',
  Photo = 'photo',
  Radio = 'radio',
  Text = 'text',
  Textarea = 'textarea',
  Checkbox = 'checkbox',
  Numeric = 'numeric',
  Multiselect = 'multiselect',
  DateTime = 'datetime',
}

export interface BackendFieldItem {
  id: string;
  name: string;
}

export enum BackendFieldValidator {
  MaxLength = 'maxLength',
  MinLength = 'minLength',
  Number = 'number',
  Positive = 'positive',
  Text = 'text',
}

export type BackendFieldArray = BackendFieldDefinition[]
export type BackendFieldMap = { [fieldId: string]: BackendFieldDefinition }
