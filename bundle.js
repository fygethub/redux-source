function applyMiddleware(middlewares) {
  function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg
    }
    if (funcs.length === 1) {
      return funcs[0]
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
  }

  return (createStore) => function (...args) {
    const store = createStore(...args);

    let dispatch = () => {
      throw new Error(`一些错误信息`)
    };
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };

    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);


    return {
      ...store,
      dispatch,
    }
  }
}

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
      finalReducers[key] = reducers[key];
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
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state
  }
}

const randomString = function randomString() {
    return Math.random().toString(36).substring(7).split('').join('.');
};

const ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
        return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
};

function createStore(reducer, preloadedState, enhancer) {
    let state = preloadedState;
    let currReducer = reducer;
    let currentListeners = [];

    if (enhancer) {
        return enhancer(createStore)(reducer, preloadedState);
    }

    const subscribe = (cb) => {
        currentListeners.push(cb);
        let isSubscribe = true;
        return () => {
            if (!isSubscribe) {
                return;
            }
            isSubscribe = false;
            const index = currentListeners.indexOf(cb);
            currentListeners.splice(index, 1);
        }
    };

    const dispatch = (action) => {
        state = currReducer(state, action);
        currentListeners.forEach(fn => fn());
    };

    const getState = () => {
        return state;
    };

    dispatch({
        type: ActionTypes.INIT
    });

    return {
        getState,
        dispatch,
        subscribe,
    }
}

export { applyMiddleware, combineReducers, createStore as creatStore };
