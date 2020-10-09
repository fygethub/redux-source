
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
            currentListeners.splice(index, 1)
        }
    };

    const dispatch = (action) => {
        state = currReducer(state, action);
        currentListeners.forEach(fn => fn())
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


export default createStore;
