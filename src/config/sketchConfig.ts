/* eslint-disable import/prefer-default-export */
import getEnvironment from './environment';

const {
  REACT_APP_SKETCH_URL,
} = getEnvironment();

export const sketchConfig = {
  sketchUrl: REACT_APP_SKETCH_URL,
};
