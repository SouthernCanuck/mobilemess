import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { selectors as inspectionsSelectors } from 'ducks/inspection';
import { getFieldsBySection } from 'helpers/backendForm';

import GeneratedSection from 'components/forms/GeneratedSection';
import SectionHeader from 'components/forms/SectionHeader';
import {
  sections,
  sectionList,
} from 'constants/sectionNames';
import { FieldValueMap } from 'types/fieldValue';
import { InspectionSectionsCountMap } from 'types/fieldsSection';
import { getSectionsList } from 'helpers/sections';
import { BackendSectionList } from 'types/api/backendSection';

interface OwnProps {
  values: FieldValueMap;
  sectionsCount: InspectionSectionsCountMap;
  fieldsBySection: BackendSectionList;
}
const FirstFamilyView: React.FC<OwnProps> = ({
  values, sectionsCount, fieldsBySection,
}) => {
  const sectionsForRender = getSectionsList(sectionList, sectionsCount, fieldsBySection);

  return (
    <ScrollView stickyHeaderIndices={sectionsForRender.map((sectionId, index) => index * 2)}>
      {
        sectionsForRender.map((section, index) => ([
          <SectionHeader
            key={`header-${section.sectionId}-${index.toString()}`}
            values={values}
            sectionDefinition={section}
          >
            {sections[section.sectionId].name}
            {(section.index > 0) ? `#${section.index + 1}` : ''}
          </SectionHeader>,
          <GeneratedSection
            key={`section-${section.sectionId}-${index.toString()}`}
            sectionDefinition={section}
          />,
        ]))
      }
    </ScrollView>
  );
};

export default connect<OwnProps>(
  (state: any) => ({
    values: inspectionsSelectors.getValues(state),
    sectionsCount: inspectionsSelectors.getSectionsCount(state),
    fieldsBySection: getFieldsBySection(),
  }),
)(FirstFamilyView);
