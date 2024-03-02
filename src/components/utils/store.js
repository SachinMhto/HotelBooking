// store.js
import { createStore } from 'redux';

const initialState = {
  confirmationCode: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CONFIRMATION_CODE':
      return { ...state, confirmationCode: action.payload };
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;
