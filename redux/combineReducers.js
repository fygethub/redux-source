/*
function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  const currState = {};

  return function (state, action) {
    for (let key of keys) {
      if (typeof reducers[key] === 'function') {
        currState[key] = reducers[key](currState[key], action)
      }
    }
    return currState
  }
}
*/


function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  return function (state = {}, action) {
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state
  }
}

module.exports = combineReducers;
