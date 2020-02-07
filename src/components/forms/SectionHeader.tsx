import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';

import { actions as inspectionActions } from 'ducks/inspection';
import dimensions from 'styles/dimensions';
import colors from 'styles/colors';
import icons from 'resources/icons';
import SectionImageField from 'components/forms/SectionImageField';
import { getMultiValuesSize } from 'helpers/multiValues';
import { getSectionPhotoId } from 'helpers/backendForm';
import { FieldValueMap } from 'types/fieldValue';
import { getFieldId, getSectionFieldPath } from 'helpers/fieldValue';

import { font } from 'components/elements/typography';
import { ButtonSmall } from 'components/elements/buttons';
import { InspectionSection } from 'types/fieldsSection';
import RemoveSectionButton from 'components/forms/RemoveSectionButton';

const styles = StyleSheet.create({
  header: {
    zIndex: 100,
    marginBottom: dimensions.spacing * 2,
    paddingTop: dimensions.spacing * 2,
    paddingHorizontal: dimensions.spacing * 2,
    backgroundColor: colors.white,
  },
  headerInner: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing,
    backgroundColor: '#F3F6FB',
  },
  headerText: {
    marginRight: 'auto',
    color: '#041243',
    ...font.bold,
    fontSize: 18,
  },
  buttonAdd: {
    marginHorizontal: dimensions.spacing,
  },
});

interface OwnProps {
  sectionDefinition: InspectionSection;
  values: FieldValueMap;
}

interface DispatchProps {
  addSection: Function;
}

const SectionHeader: React.FC<OwnProps & DispatchProps> = ({
  children, sectionDefinition, values, addSection,
}) => {
  const sectionPhotoId = getSectionPhotoId(sectionDefinition.sectionId);
  const path = getSectionFieldPath(
    sectionDefinition.sectionId,
    sectionDefinition.index,
    sectionPhotoId,
  );
  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <Text style={styles.headerText}>{children}</Text>
        { sectionDefinition.canAdd
          && (
            <ButtonSmall
              icon={icons.plus}
              style={styles.buttonAdd}
              onPress={() => addSection(sectionDefinition.sectionId)}
            />
          )
        }
        {sectionDefinition.canRemove
          && (
            <RemoveSectionButton
              sectionId={sectionDefinition.sectionId}
            />
          )
        }
        <SectionImageField
          id={getFieldId(path)}
          index={getMultiValuesSize(values, sectionPhotoId)}
          values={values}
          path={path}
        />
      </View>
    </View>
  );
};

export default connect<{}, DispatchProps>(
  null,
  (dispatch: Dispatch) => bindActionCreators(
    {
      addSection: inspectionActions.addSection,
    },
    dispatch,
  ),
)(SectionHeader);
