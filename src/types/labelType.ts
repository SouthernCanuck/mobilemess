
export interface ImageLabelDefinition {
  id: string;
  name: string;
  sectionId: string;
}

export interface ImageLabelMap { [fieldId: string]: ImageLabelDefinition }
export type ImageLabelList = ImageLabelDefinition[]
