import { REQUEST_PULLS, RECEIVE_PULLS } from '../actions/pulls';

const pulls = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PULLS:
      const newState = Object.assign([], action.json);
      newState.forEach((pull) => {
        pull.pull.created_at = new Date(pull.pull.created_at).getTime();
        if (pull.comments) {
          pull.comments.forEach((comment) => {
            comment.created_at = new Date(comment.created_at).getTime();
          });
        }
      });
      return newState;
      break;
  }

  return state;
}

export default pulls;
