const createStore = require('../creatStore');
const applyMiddleware = require('../applyMiddleware');


function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text]);
    default:
      return state
  }
}

function logger({getState, dispatch}) {
  return next => action => {
    console.log('will dispatch', action);
    const returnValue = next(action);
    console.log('state after dispatch', getState());

    return returnValue
  }
}

const store = createStore(todos, ['Use Redux'], applyMiddleware([logger]));
store.dispatch({
  type: 'ADD_TODO',
  text: 'Understand the middleware'
});
