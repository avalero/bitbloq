import {takeEvery, call, put, select} from 'redux-saga/effects';
import {updateSoftwareCode as updateSoftwareCodeAction} from '../actions/software';
import {showNotification, hideNotification} from '../actions/ui';
import {generateArduinoCode, generateOOMLCode} from '../lib/code-generation';
import web2board, {
  ConnectionError,
  CompileError,
  BoardNotDetectedError,
} from '../lib/web2board';

const delay = (ms) => new Promise(res => setTimeout(res, ms))

function* updateSoftwareCode() {
  const bloqs = yield select(state => state.software.bloqs);
  const hardware = yield select(state => state.hardware);

  yield put(updateSoftwareCodeAction(generateArduinoCode(bloqs, hardware)));
}

function* uploadCode() {
  const code = yield select(state => state.software.code);

  try {
    const uploadGen = web2board.upload(code);

    while (true) {
      const {value: reply, done} = yield call([uploadGen, uploadGen.next]);
      const fn = reply['function'];

      if (fn === 'is_compiling') {
        yield put(showNotification('compiling', 'Compiling'));
      } else {
        yield put(hideNotification('compiling'));
      }

      if (fn === 'is_uploading') {
        yield put(showNotification('uploading', 'Uploading'));
      } else {
        yield put(hideNotification('uploading'));
      }

      if (done) {
        yield put(showNotification('w2b_success', 'Uploaded!', 5000));
        return;
      }
    }
  } catch (e) {
    yield put(hideNotification('compiling'));
    yield put(hideNotification('uploading'));
    if (e instanceof ConnectionError) {
      yield put(showNotification('w2b_error', 'Could not connect to Web2Board', 5000));
    }
    if (e instanceof BoardNotDetectedError) {
      yield put(showNotification('w2b_error', 'Board not detected', 5000));
    }
    if (e instanceof CompileError) {
      yield put(showNotification('w2b_error', 'Error compiling', 5000));
    }
  }
}

function* watchNotificationTime({ key, time }) {
  if (time) {
    yield call(delay, time);
    yield put(hideNotification(key));
  }
}

function* rootSaga() {
  yield takeEvery('UPDATE_SOFTWARE_BLOQS', updateSoftwareCode);
  yield takeEvery('UPLOAD_CODE', uploadCode);
  yield takeEvery('SHOW_NOTIFICATION', watchNotificationTime);
}

export default rootSaga;
