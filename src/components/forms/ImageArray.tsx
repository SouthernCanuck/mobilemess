import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackendFieldMap } from 'types/api/backendForm';
import { getOneOrAllIndexes } from 'helpers/multiValues';
import ImageField from 'components/forms/ImageField';
import Label from 'components/forms/Label';
import dimensions from 'styles/dimensions';
import { getDictionary } from 'helpers/backendForm';
import { selectors as inspectionSelectors } from 'ducks/inspection';
import { FieldValueMap, FormPath } from 'types/fieldValue';
import { getFieldDefinitionId } from 'helpers/fieldValue';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: dimensions.spacing,
    marginBottom: dimensions.spacing,
  },
  scroll: {
    paddingBottom: dimensions.spacing / 2,
  },
});

interface OwnProps {
  id: string;
  path: FormPath;
}

interface StateProps {
  values: FieldValueMap;
  errors: FieldValueMap;
  dictionary: BackendFieldMap;
}

type Props = OwnProps & StateProps;

const ImageArray = (props: Props): JSX.Element | null => {
  const {
    id, path, values, dictionary,
  } = props;
  const definitionId = getFieldDefinitionId(path);
  const config = dictionary[definitionId];
  if (!config) {
    console.debug('Image field is not found', definitionId);
    return null;
  }

  const imageIndexes = getOneOrAllIndexes(values, id);
  return (
    <View style={styles.container}>
      <Label>{config.labelText}</Label>
      <ScrollView horizontal style={styles.scroll}>
        {imageIndexes.map((index: number) => (
          <ImageField
            key={index}
            id={id}
            path={path}
            values={values}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default connect<StateProps>(
  (state: any) => ({
    values: inspectionSelectors.getValues(state),
    errors: inspectionSelectors.getErrors(state),
    dictionary: getDictionary(),
  }),
)(ImageArray);
