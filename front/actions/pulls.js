import fetch from 'isomorphic-fetch';

export const REQUEST_PULLS = 'REQUEST_PULLS';
export const RECEIVE_PULLS = 'RECEIVE_PULLS';

export function fetchPulls() {
  return (dispatch, getState) => {
    dispatch(request());
    return fetch('data.json', { method: 'GET' })
      .then(response => response.json())
      .then(json => dispatch(receive(dispatch, json)));
  };
};

function request() {
  return { type: REQUEST_PULLS };
};

function receive(dispatch, json) {
  setTimeout(() => { dispatch(fetchPulls()); }, 5000);
  return Object.assign({ type: RECEIVE_PULLS }, { json });
};
