
import React from 'react';
import { createStackNavigator } from 'react-navigation';

import routeNames from 'constants/routeNames';
import WorkOrdersListScreen from 'components/screens/WorkOrdersListScreen';
import InspectionScreen from 'components/screens/InspectionScreen';
import ConfirmPictureScreen from 'components/screens/ConfirmPictureScreen';
import SketchScreen from 'components/screens/SketchScreen';
import GalleryScreen from 'components/screens/GalleryScreen';
import PictureList from 'components/forms/PictureList';


import MainHeader from 'components/headers/MainHeader';
import GalleryHeader from 'components/headers/GalleryHeader';
import InspectionHeader from './headers/InspectionHeader';

export default createStackNavigator(
  {
    [routeNames.ORDERS_LIST]: WorkOrdersListScreen,
    [routeNames.INSPECTION]: {
      screen: InspectionScreen,
      navigationOptions: {
        headerTitle: <InspectionHeader />,
      },
    },
    [routeNames.PICTURE_SELECT]: {
      screen: PictureList,
    },
    [routeNames.CONFIRM_PICTURE]: {
      screen: ConfirmPictureScreen,
      navigationOptions: {
        header: null,
      },
    },
    [routeNames.GALLERY]: {
      screen: GalleryScreen,
      navigationOptions: {
        headerTitle: <GalleryHeader />,
      },
    },
    [routeNames.SKETCH]: {
      screen: SketchScreen,
      navigationOptions: {
        headerTitle: null,
        headerBackTitle: 'Back',
      },
    },
  },
  {
    initialRouteName: routeNames.ORDERS_LIST,
    defaultNavigationOptions: {
      headerTitle: <MainHeader />,
    },
  },

);
