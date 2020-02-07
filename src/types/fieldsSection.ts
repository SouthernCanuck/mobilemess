import { FormPath } from 'types/fieldValue';
import { BackendSectionProperty } from './api/backendSection';

export interface FrontendSectionProperty {
  id: string;
  path: FormPath;
  width: number;
}

export interface FrontendSectionDefinition {
  sectionId: string;
  properties: FrontendSectionProperty[];
}


export interface InspectionSectionCount {
  sectionId: string;
  count: number;
}

export type InspectionSectionsCountMap = { [sectionId: string]: InspectionSectionCount }

export interface InspectionSection {
  sectionId: string;
  index: number;
  properties: BackendSectionProperty[];
  canAdd: boolean;
  canRemove: boolean;
}

export type InspectionSectionList = InspectionSection[]
