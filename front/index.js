import path from 'path'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';
import PrList from './components/PrList';

let store = createStore(
  reducers,
  window.devToolsExtension ? window.devToolsExtension() : undefined,
  applyMiddleware(
    thunkMiddleware
  )
)

render(
  <Provider store={store}>
    <PrList />
  </Provider>,
  document.getElementById('root')
)
