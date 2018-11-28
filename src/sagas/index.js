import {takeEvery, call, put, select} from 'redux-saga/effects';
import {updateCode as updateCodeAction} from '../actions/software';
import {showNotification, hideNotification} from '../actions/ui';
import {undo as undoThreed, redo as redoThreed, selectObject} from '../actions/threed';
import {generateArduinoCode, generateOOMLCode} from '../lib/code-generation';
import web2board, {
  ConnectionError,
  CompileError,
  BoardNotDetectedError,
} from '../lib/web2board';

const delay = ms => new Promise(res => setTimeout(res, ms));

function* updateCode() {
  const bloqs = yield select(state => state.software.bloqs);
  const hardware = yield select(state => state.hardware);

  yield put(updateCodeAction(generateArduinoCode(bloqs, hardware)));
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
      yield put(
        showNotification('w2b_error', 'Could not connect to Web2Board', 5000),
      );
    }
    if (e instanceof BoardNotDetectedError) {
      yield put(showNotification('w2b_error', 'Board not detected', 5000));
    }
    if (e instanceof CompileError) {
      yield put(showNotification('w2b_error', 'Error compiling', 5000));
    }
  }
}

function* watchNotificationTime({payload: {key, time}}) {
  if (time) {
    yield call(delay, time);
    yield put(hideNotification(key));
  }
}

function* watchKeyDown({payload: key}) {
  const shiftPressed = yield select(state => state.ui.shiftPressed);
  const controlPressed = yield select(state => state.ui.controlPressed);
  const threedPast = yield select(state => state.threed.scene.past);
  const threedFuture = yield select(state => state.threed.scene.future);

  if (key === 'z' && controlPressed && threedPast.length) {
    yield put(undoThreed());
  }
  if (key === 'Z' && controlPressed && threedFuture.length) {
    yield put(redoThreed());
  }
}

function* watchCreateObject() {
  const objects = yield select(state => state.threed.scene.objects);
  yield put(selectObject(objects[objects.length - 1]));
}

function* watchSetAdvancedMode({payload: isAdvanced}) {
  sessionStorage.setItem('advancedMode', JSON.stringify(isAdvanced));
}

function* rootSaga() {
  yield takeEvery('SOFTWARE_UPDATE_BLOQS', updateCode);
  yield takeEvery('SOFTWARE_UPLOAD_CODE', uploadCode);
  yield takeEvery('UI_SHOW_NOTIFICATION', watchNotificationTime);
  yield takeEvery('UI_KEY_DOWN', watchKeyDown);
  yield takeEvery('THREED_CREATE_OBJECT', watchCreateObject);
  yield takeEvery('THREED_SET_ADVANCED_MODE', watchSetAdvancedMode);
}

export default rootSaga;
