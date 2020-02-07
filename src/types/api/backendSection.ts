
export interface BackendSectionProperty {
  id: string;
  name?: string;
}

export interface BackendSectionDefinition {
  sectionId: string;
  properties: BackendSectionProperty[];
}

export type BackendSectionList = { [sectionId: string]: BackendSectionDefinition };
