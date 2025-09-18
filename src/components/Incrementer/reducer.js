import { createContext, useReducer } from 'react';
import { INCREMENT, DECREMENT } from './types';

export const Context = createContext();
export const { Consumer, Provider } = Context;

const initialState = {
  count: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        count: state.count + action.payload,
      };
    case DECREMENT:
      return {
        count: state.count - action.payload,
      };
    default:
      throw new Error();
  }
}

export default function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={[state, dispatch]}>{props.children}</Provider>;
}
