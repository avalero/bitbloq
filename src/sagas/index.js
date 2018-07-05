import {takeEvery, put, select} from 'redux-saga/effects';
import {updateSoftwareCode as updateSoftwareCodeAction} from '../actions/software';
import {update3DCode as update3DCodeAction} from '../actions/threed';
import {generateArduinoCode, generateJscadCode} from '../lib/code-generation';

function* updateSoftwareCode() {
  const bloqs = yield select(state => state.software.bloqs);
  const hardware = yield select(state => state.hardware);

  yield put(updateSoftwareCodeAction(generateArduinoCode(bloqs, hardware)));
}

function* update3DCode() {
  const bloqs = yield select(state => state.threed.bloqs);

  yield put(update3DCodeAction(generateJscadCode(bloqs)));
}

function* rootSaga() {
  yield takeEvery('UPDATE_SOFTWARE_BLOQS', updateSoftwareCode);
  yield takeEvery('UPDATE_THREED_BLOQS', update3DCode);
}

export default rootSaga;
