import { takeEvery, put, select } from 'redux-saga/effects';
import {updateCode as updateCodeAction} from '../actions/code';
import {generateCode} from '../lib/code-generation';

function* updateCode() {
  const bloqs = yield select((state) => state.bloqs.bloqs);
  const hardware = yield select((state) => state.hardware);

  yield put(updateCodeAction(generateCode(bloqs, hardware)));
}

function* mySaga() {
  yield takeEvery('STOP_DRAGGING_BLOQ', updateCode);
  yield takeEvery('UPDATE_BLOQ', updateCode);
}


export default mySaga;
