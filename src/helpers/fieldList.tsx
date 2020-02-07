import { FormPath } from 'types/fieldValue';
import { FrontendSectionDefinition, FrontendSectionProperty, InspectionSection } from 'types/fieldsSection';
import { BackendFieldMap, BackendFieldType } from 'types/api/backendForm';
import { MAX_ROW_WIDTH } from 'constants/formWidth';
import { getFieldWidth } from 'helpers/backendForm';
import { getSectionFieldPath } from 'helpers/fieldValue';

export const getFieldChildren = (
  id: string,
  path: FormPath,
  dictionary: BackendFieldMap,
): FrontendSectionProperty[] => {
  const fieldDefinition = dictionary[id];
  const frontendField: FrontendSectionProperty = {
    id,
    path,
    width: getFieldWidth(fieldDefinition),
  };
  if (fieldDefinition.fieldType !== BackendFieldType.Object) {
    return [frontendField];
  }

  const childFlatList = (fieldDefinition.properties ?? [])
    .reduce((
      result: FrontendSectionProperty[],
      property,
    ) => {
      const childPath = [...path, { id: property.id }];
      const childList = getFieldChildren(property.id, childPath, dictionary);
      return result.concat(childList);
    }, []);

  return childFlatList;
};

/**
 * Get plain list from tree-structure
 * we need it for create rows and columns layout
 */
export const getFieldList = (
  sectionDefinition: InspectionSection,
  dictionary: BackendFieldMap,
): FrontendSectionDefinition => {
  const fieldList = sectionDefinition.properties
    .reduce((result: FrontendSectionProperty[], backendField) => {
      const { id } = backendField;
      const path = getSectionFieldPath(
        sectionDefinition.sectionId,
        sectionDefinition.index,
        backendField.id,
      );

      const oneFieldList = getFieldChildren(id, path, dictionary);
      return result.concat(oneFieldList);
    }, []);

  const plainSection: FrontendSectionDefinition = {
    sectionId: sectionDefinition.sectionId,
    properties: fieldList,
  };

  return plainSection;
};

/**
 * Get plain list from tree-structure
 * we need it for create rows and columns layout
 */
export const getFieldsByRow = (
  section: FrontendSectionDefinition,
): FrontendSectionProperty[][] => {
  const rows: FrontendSectionProperty[][] = [[]];

  let rowWidth = 0;
  section.properties.forEach((field) => {
    const row = rows[rows.length - 1];
    const fieldWidth = field.width;
    if (rowWidth + fieldWidth > MAX_ROW_WIDTH) {
      rowWidth = fieldWidth;
      rows.push([field]);
    } else {
      rowWidth += fieldWidth;
      row.push(field);
    }
  });

  return rows;
};
