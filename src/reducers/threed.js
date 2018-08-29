const initialState = {
  selectedObjects: [],
  objects: [],
};

const threed = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_OBJECT':
      return {
        ...state,
        selectedObjects: [...state.selectedObjects, action.objectId],
      };

    case 'DESELECT_OBJECT':
      return {
        ...state,
        selectedObjects: state.selectedObjects.filter(
          id => id !== action.objectId,
        ),
      };

    case 'CREATE_OBJECT':
      return {
        ...state,
        objects: [...state.objects, action.object],
        selectedObjects: [action.object.id],
      };

    case 'UPDATE_OBJECT':
      return {
        ...state,
        objects: state.objects.map(o => {
          if (o.id === action.object.id) {
            return action.object;
          } else {
            return o;
          }
        }),
      };

    case 'WRAP_OBJECTS':
      return {
        ...state,
        objects: [
          ...state.objects.filter(o => !action.children.includes(o)),
          action.parent
        ],
        selectedObjects: [action.parent.id]
      };

    default:
      return state;
  }
};

export default threed;
