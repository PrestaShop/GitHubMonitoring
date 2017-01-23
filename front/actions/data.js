import fetch from 'isomorphic-fetch';

export const REQUEST_DATA = 'REQUEST_USER_LOGIN';
export const RECEIVE_DATA = 'RECEIVE_USER_LOGIN';

export function fetchData() {
  return (dispatch, getState) => {
    dispatch(request());
    return fetch('data.json', { method: 'GET' })
      .then(response => response.json())
      .then(json => dispatch(receive(dispatch, json)));
  };
};

function request() {
  return { type: REQUEST_DATA };
};

function receive(dispatch, json) {
  setTimeout(() => { dispatch(fetchData()); }, 5000);
  return Object.assign({ type: RECEIVE_DATA }, { json });
};
