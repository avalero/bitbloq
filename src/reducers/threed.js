const initialState = {
  selectedIds: [],
  objects: [],
  activeOperation: null,
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
    if (object.id === updated.id) {
      return updated;
    } else {
      const {parameters: {children = []} = {}} = object;
      if (children.length) {
        const updatedChildren = updateObject(children, updated);
        if (
          children.length === updatedChildren.length &&
          children.every(c => updatedChildren.includes(c))
        ) {
          return object;
        } else {
          return {
            ...object,
            parameters: {
              ...object.parameters,
              children: updateObject(children, updated),
            },
          };
        }
      } else {
        return object;
      }
    }
  });
};

const threed = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_OBJECT':
      return {
        ...state,
        selectedIds: action.addToSelection
          ? [...state.selectedIds, action.object.id]
          : [action.object.id],
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
        objects: updateObject(state.objects, action.object),
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
      const {parameters = {}} = action.object;
      const {children = []} = parameters;
      const index = state.objects.indexOf(action.object);

      return {
        ...state,
        objects: [
          ...state.objects.slice(0, index),
          ...children,
          ...state.objects.slice(index + 1),
        ],
        selectedIds: state.selectedIds.filter(id => id !== action.object.id),
      };

    case 'SET_ACTIVE_OPERATION':
      return {
        ...state,
        activeOperation: {
          object: action.object,
          type: action.operationType,
          axis: action.axis,
          relative: action.relative,
        },
      };

    case 'UNSET_ACTIVE_OPERATION':
      return {
        ...state,
        activeOperation: null,
      };

    default:
      return state;
  }
};

export default threed;

export const getSelectedObjects = state =>
  state.selectedIds.map(id => findObject(state.objects, id));
