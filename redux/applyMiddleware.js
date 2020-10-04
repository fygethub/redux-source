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

module.exports = applyMiddleware;
