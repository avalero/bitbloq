const initialState = {
  selectedIds: [],
  objects: [],
};

const findObject = (objects = [], id) => {
  if (!objects.length) {
    return undefined;
  }

  const [first, ...rest] = objects;
  const {parameters: {children = []} = {}} = first;

  if (first.id === id) {
    return first;
  }

  return findObject(children, id) || findObject(rest, id);
};

const updateObject = (objects, updated) => {
  return objects.map(object => {
    console.log(object, updated);
    if (object.id === updated.id) {
      return updated;
    } else {
      const {parameters: {children = []} = {}} = object;
      if (children.length) {
        console.log('Children', children);
        return {
          ...object,
          parameters: {
            ...object.parameters,
            children: updateObject(children, updated),
          }
        };
      } else {
        return object;
      }
    }
  });
}

const threed = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_OBJECT':
      return {
        ...state,
        selectedIds: [...state.selectedIds, action.object.id],
      };

    case 'DESELECT_OBJECT':
      return {
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== action.object.id),
      };

    case 'CREATE_OBJECT':
      return {
        ...state,
        objects: [...state.objects, action.object],
        selectedIds: [action.object.id],
      };

    case 'UPDATE_OBJECT':
      return {
        ...state,
        objects: updateObject(state.objects, action.object)
      };

    case 'WRAP_OBJECTS':
      return {
        ...state,
        objects: [
          ...state.objects.filter(o => !action.children.includes(o)),
          action.parent,
        ],
        selectedIds: [action.parent.id],
      };

    case 'DELETE_OBJECT':
      return {
        ...state,
        objects: state.objects.filter(o => o !== action.object),
        selectedIds: state.selectedIds.filter(id => id !== action.object.id),
      };

    default:
      return state;
  }
};

export default threed;


export const getSelectedObjects = state =>
  state.selectedIds.map(id => findObject(state.objects, id));
