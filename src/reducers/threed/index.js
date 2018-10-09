import {combineReducers} from 'redux';
import scene, {findObject} from './scene';
import ui from './ui';

export const getObjects = state => state.scene.present;
export const getSelectedObjects = state =>
  state.ui.selectedIds.map(id =>
    findObject(state.scene.present, 'id', id)
  ).filter(o => o);

export const getLastObject = state => {
  const objects = state.scene.present;
  return objects[objects.length - 1];
}

const threed = combineReducers({
  scene,
  ui
});

export default threed;
