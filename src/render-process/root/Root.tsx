import * as React from 'react';
import * as Redux from 'react-redux';
import { History } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';

interface IRootType {
  store: Redux.Store<any>;
  history: History
};

var Root = function({ store, history }: IRootType) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>

  );
}

export default Root;
