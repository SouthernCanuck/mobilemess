import React from 'react';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

import dimensions from 'styles/dimensions';
import icons from 'resources/icons';
import { ButtonSmall } from 'components/elements/buttons';
import CameraLibrarySelector from 'components/images/CameraLibrarySelector';
import { FieldValueMap, FormPath } from 'types/fieldValue';


interface OwnProps {
  id: string;
  values: FieldValueMap;
  index?: number;
  path: FormPath;
}

type Props = OwnProps & NavigationInjectedProps;

const SectionImageField: React.FC<Props> = ({ id, index, path }) => (
  <CameraLibrarySelector
    id={id}
    index={index}
    path={path}
  >
    <ButtonSmall icon={icons.camera} style={{ marginLeft: dimensions.spacing }} />
  </CameraLibrarySelector>
);

export default withNavigation(SectionImageField);
