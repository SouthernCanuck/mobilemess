import React from 'react';
import { connect } from 'react-redux';

import { Row, RowItem, FormSection } from 'components/elements/containers';
import GeneratedProperty from 'components/forms/GeneratedProperty';
import { getFieldList, getFieldsByRow } from 'helpers/fieldList';
import { BackendFieldMap } from 'types/api/backendForm';
import { getDictionary } from 'helpers/backendForm';
import { InspectionSection } from 'types/fieldsSection';

interface OwnProps {
  sectionDefinition: InspectionSection;
}

interface StateProps {
  dictionary: BackendFieldMap;
}

const GeneratedSection: React.FC<OwnProps & StateProps> = ({ sectionDefinition, dictionary }) => {
  const fieldList = getFieldList(sectionDefinition, dictionary);
  const fieldsByRow = getFieldsByRow(fieldList);
  return (
    <FormSection>
      {
        /* eslint-disable react/no-array-index-key */
        fieldsByRow.map((propertyList, index) => (
          <Row key={index}>
            {propertyList.map(property => (
              <RowItem
                key={property.id}
                flex={property.width}
              >
                <GeneratedProperty
                  path={property.path}
                />
              </RowItem>
            ))}
          </Row>
        ))
      }
    </FormSection>
  );
};

export default connect<StateProps>(
  (state: any) => ({
    dictionary: getDictionary(),
  }),
)(GeneratedSection);
