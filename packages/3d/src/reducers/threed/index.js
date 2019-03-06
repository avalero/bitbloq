import {combineReducers} from 'redux';
import {createSelector} from 'reselect';
import scene, {findObject} from './scene';
import ui from './ui';

export const getObjects = state => state.scene.objects;

export const getSelectedIds = state => state.ui.selectedIds;

export const getSelectedObjects = createSelector(
  getObjects,
  getSelectedIds,
  (objects, selectedIds) =>
    selectedIds
      .map(id => findObject(objects, object => object.id === id))
      .filter(o => o),
);

export const getLastObject = state => {
  const objects = state.scene.objects;
  return objects[objects.length - 1];
};

const threed = combineReducers({
  scene,
  ui,
});

export default threed;
