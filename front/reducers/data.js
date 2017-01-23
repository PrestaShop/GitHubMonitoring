import { REQUEST_DATA, RECEIVE_DATA } from '../actions/data';

const data = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return Object.assign([], state, action.json );
      break;
  }

  return state;
}

export default data;
