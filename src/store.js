import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import bloqtest from './reducers';

import mySaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  bloqtest,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(mySaga);

export default store;
