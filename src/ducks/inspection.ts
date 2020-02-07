/* eslint-disable @typescript-eslint/explicit-function-return-type,func-names */
import { Reducer, AnyAction as Action } from 'redux';

import { setValue, removeValue } from 'helpers/multiValues';
import { getImages } from 'helpers/images';
import { FieldValueMap, FieldDataValue, FormPath } from 'types/fieldValue';
import { getDictionary } from 'helpers/backendForm';
import { sectionList } from 'constants/sectionNames';
import { InspectionSectionsCountMap } from 'types/fieldsSection';
import { getInitialSections } from 'helpers/sections';

export const NAME = 'INSPECTION';
const VALUES = 'values';
const ERRORS = 'errors';
const SECTIONS_COUNT = 'sectionsCount';
const SELECTING_PICTURE_FOR = 'isCameraRollShown';
const SELECTING_PICTURE_FOR_INDEX = 'SELECTING_PICTURE_FOR_INDEX';

export interface State {
  [VALUES]: FieldValueMap;
  [ERRORS]: FieldValueMap;
  [SECTIONS_COUNT]: InspectionSectionsCountMap;
  [SELECTING_PICTURE_FOR]?: string;
  [SELECTING_PICTURE_FOR_INDEX]? : number;
}

// Initial State
export const initialState: State = {
  [VALUES]: {},
  [ERRORS]: {},
  [SECTIONS_COUNT]: getInitialSections(sectionList),
  [SELECTING_PICTURE_FOR]: undefined,
  [SELECTING_PICTURE_FOR_INDEX]: undefined,
};

// Action Types
const CHANGE_VALUE = `${NAME}/CHANGE_VALUE`;
const REMOVE_VALUE = `${NAME}/REMOVE_VALUE`;
const APPLY_CHANGES = `${NAME}/APPLY_CHANGES`;
const SELECT_PICTURE_FOR = `${NAME}/SELECT_PICTURE_FOR`;
const HIDE_PICTURE_LIST = `${NAME}/HIDE_PICTURE_LIST`;
const RESET = `${NAME}/RESET`;
const ADD_SECTION = `${NAME}/ADD_SECTION`;
const REMOVE_SECTION = `${NAME}/REMOVE_SECTION`;

// Action Creators
export const actions = {
  changeValue: (id: string, index: number, value: FieldDataValue, path: FormPath): Action => ({
    type: CHANGE_VALUE,
    payload: {
      id,
      index,
      value,
      path,
    },
  }),
  removeValue: (id: string, index: number): Action => ({
    type: REMOVE_VALUE,
    payload: {
      id,
      index,
    },
  }),
  selectPictureFor: (id: string, index: number): Action => ({
    type: SELECT_PICTURE_FOR,
    payload: {
      id,
      index,
    },
  }),
  hidePictureList: (): Action => ({
    type: HIDE_PICTURE_LIST,
  }),
  reset: (): Action => ({
    type: RESET,
  }),
  applyChanges: (values: FieldValueMap): Action => ({
    type: APPLY_CHANGES,
    payload: values,
  }),
  addSection: (sectionId: string): Action => ({
    type: ADD_SECTION,
    payload: sectionId,
  }),
  removeSection: (sectionId: string): Action => ({
    type: REMOVE_SECTION,
    payload: sectionId,
  }),
};

// Selectors
const getInspection = (state: { [NAME]: State }): State => state[NAME];
const getValues = (state: { [NAME]: State }) => getInspection(state)[VALUES];
const getErrors = (state: { [NAME]: State }) => getInspection(state)[ERRORS];
const getSectionsCount = (state: { [NAME]: State }) => getInspection(state)[SECTIONS_COUNT];
const getSelectingPictureFor = (state: { [NAME]: State }) => getInspection(state)[SELECTING_PICTURE_FOR];
const getSelectingPictureForIndex = (state: { [NAME]: State }) => getInspection(state)[SELECTING_PICTURE_FOR_INDEX];
const isCameraRollShown = (state: { [NAME]: State }) => getInspection(state)[SELECTING_PICTURE_FOR] !== undefined;
const getAllImages = (state: { [NAME]: State }) => {
  const values = getValues(state);
  const dictionary = getDictionary();
  return getImages(values, dictionary);
};

export const selectors = {
  getValues,
  getErrors,
  getSectionsCount,
  getSelectingPictureFor,
  getSelectingPictureForIndex,
  isCameraRollShown,
  getAllImages,
};

// Reducer
export const reducer = (
  (state: State = initialState, action: Action): State => {
    switch (action.type) {
      case CHANGE_VALUE:
        return {
          ...state,
          [VALUES]: setValue(
            state[VALUES],
            action.payload.path,
            action.payload.value,
            action.payload.id,
            action.payload.index,
          ),
        };
      case REMOVE_VALUE:
        return {
          ...state,
          [VALUES]: removeValue(state[VALUES], action.payload.id, action.payload.index),
        };
      case SELECT_PICTURE_FOR:
        return {
          ...state,
          [SELECTING_PICTURE_FOR]: action.payload.id,
          [SELECTING_PICTURE_FOR_INDEX]: action.payload.index,
        };
      case HIDE_PICTURE_LIST:
        return {
          ...state,
          [SELECTING_PICTURE_FOR]: undefined,
          [SELECTING_PICTURE_FOR_INDEX]: undefined,
        };
      case RESET:
        return initialState;
      case APPLY_CHANGES:
        return {
          ...state,
          values: { ...action.payload },
        };
      case ADD_SECTION:
        return {
          ...state,
          sectionsCount: {
            ...state.sectionsCount,
            [action.payload]: {
              ...state.sectionsCount[action.payload],
              count: state.sectionsCount[action.payload].count + 1,
            },
          },
        };
      case REMOVE_SECTION:
        return {
          ...state,
          sectionsCount: {
            ...state.sectionsCount,
            [action.payload]: {
              ...state.sectionsCount[action.payload],
              count: state.sectionsCount[action.payload].count - 1,
            },
          },
        };
      default:
        return state;
    }
  }
) as Reducer<State, Action>;
