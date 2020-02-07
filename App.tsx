import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './src/configureStore';
import App from './src/components/App';


export default () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
);
