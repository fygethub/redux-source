const createStore = require('../creatStore');

function counter(state = 0, action) {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'decrement':
      return state - 1
    default:
      return state
  }
}

const log1 = () => console.log('subscribe1:--', store.getState());
const log2 = () => console.log('subscribe2:>>', store.getState());
let store = createStore(counter)
console.log(store.getState())
const unsub1 = store.subscribe(log1)
const unsub2 = store.subscribe(log2)
store.dispatch({type: 'add'})
// 1
store.dispatch({type: 'add'})
unsub1()
// 2
store.dispatch({type: 'decrement'})
// 1
unsub2()
