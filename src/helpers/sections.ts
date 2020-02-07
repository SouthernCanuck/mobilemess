import { InspectionSectionsCountMap, InspectionSectionList } from 'types/fieldsSection';
import { BackendSectionList } from 'types/api/backendSection';
import { DEFAULT_SECTION_NUMBER, MAX_SECTION_NUMBER } from 'constants/sectionNames';

export const getInitialSections = (
  sectionsIds: string[],
): InspectionSectionsCountMap => {
  const result: InspectionSectionsCountMap = {};
  return sectionsIds.reduce((sections: InspectionSectionsCountMap, sectionId: string) => {
    // eslint-disable-next-line no-param-reassign
    sections[sectionId] = {
      sectionId,
      count: DEFAULT_SECTION_NUMBER,
    };
    return sections;
  }, result);
};

export const getSectionsList = (
  sectionsIds: string[],
  sectionsCount: InspectionSectionsCountMap,
  fieldsBySection: BackendSectionList,
): InspectionSectionList => {
  const result: InspectionSectionList = [];
  sectionsIds.forEach(sectionId => {
    const { count } = sectionsCount[sectionId];
    if (count <= 0) {
      result.push({
        sectionId,
        index: 0,
        properties: [],
        canAdd: true,
        canRemove: false,
      });
    } else {
      for (let i = 0; i < count; i++) {
        result.push({
          sectionId,
          index: i,
          properties: fieldsBySection[sectionId].properties,
          canAdd: (count < MAX_SECTION_NUMBER),
          canRemove: (i === count - 1),
        });
      }
    }
  });

  return result;
};
