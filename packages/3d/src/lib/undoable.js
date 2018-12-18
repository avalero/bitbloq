function undoable(reducer, undoAction, redoAction, undoableActions) {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  };

  return function(state = initialState, action) {
    const {past, present, future} = state;

    switch (action.type) {
      case undoAction:
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      case redoAction:
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      default:
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state;
        }
        if (!undoableActions.includes(action.type)) {
          return {...state, present: newPresent};
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
    }
  };
}

export default undoable;
