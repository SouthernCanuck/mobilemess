import { ImageSectionMap } from 'types/imageSection';

export const ORDER_INFORMATION = 'Order';
export const GENERAL_SECTION = 'General';
export const PARKING_SECTION = 'Parking';
export const UTILITIES_SECTION = 'Utilities';
export const NEIGHBORHOOD_SECTION = 'Neighborhood Influences';
export const INTERIOR_SECTION = 'Interior';
export const EXTERIOR_SECTION = 'Exterior';
export const APPLIANCES_SECTION = 'Appliances';
export const FOUNDATION_SECTION = 'Foundation';
export const BASEMENT_SECTION = 'Basement';
export const ATTIC_SECTION = 'Attic';
export const HEATING_SECTION = 'Heating/Cooling';
export const AMENITIES_SECTION = 'Amenities';
export const DAMAGE_SECTION = 'Damage/Condition &amp; Quality';


export const sections: ImageSectionMap = {
  [ORDER_INFORMATION]: {
    id: ORDER_INFORMATION,
    name: 'Order',
  },
  [GENERAL_SECTION]: {
    id: GENERAL_SECTION,
    name: 'General',
  },
  [PARKING_SECTION]: {
    id: PARKING_SECTION,
    name: 'Parking',
  },
  [UTILITIES_SECTION]: {
    id: UTILITIES_SECTION,
    name: 'Utilities',
  },
  [NEIGHBORHOOD_SECTION]: {
    id: NEIGHBORHOOD_SECTION,
    name: 'Neighborhood',
  },
  [INTERIOR_SECTION]: {
    id: INTERIOR_SECTION,
    name: 'Interior',
  },
  [EXTERIOR_SECTION]: {
    id: EXTERIOR_SECTION,
    name: 'Exterior',
  },
  [APPLIANCES_SECTION]: {
    id: APPLIANCES_SECTION,
    name: 'Appliances',
  },
  [FOUNDATION_SECTION]: {
    id: FOUNDATION_SECTION,
    name: 'Foundation',
  },
  [BASEMENT_SECTION]: {
    id: BASEMENT_SECTION,
    name: 'Basement',
  },
  [ATTIC_SECTION]: {
    id: ATTIC_SECTION,
    name: 'Attic',
  },
  [HEATING_SECTION]: {
    id: HEATING_SECTION,
    name: 'Heating/Cooling',
  },
  [AMENITIES_SECTION]: {
    id: AMENITIES_SECTION,
    name: 'Amenities',
  },
  [DAMAGE_SECTION]: {
    id: DAMAGE_SECTION,
    name: 'Damage',
  },
};

export const sectionList = [
  ORDER_INFORMATION,
  GENERAL_SECTION,
  PARKING_SECTION,
  UTILITIES_SECTION,
  NEIGHBORHOOD_SECTION,
  EXTERIOR_SECTION,
  INTERIOR_SECTION,
  APPLIANCES_SECTION,
  FOUNDATION_SECTION,
  BASEMENT_SECTION,
  ATTIC_SECTION,
  HEATING_SECTION,
  AMENITIES_SECTION,
  DAMAGE_SECTION,
];

export const sectionNames = sectionList.map(sectionId => sections[sectionId].name);

/**
 * How many sections by default presented on new form
 */
export const DEFAULT_SECTION_NUMBER = 1;

export const MAX_SECTION_NUMBER = 10;
