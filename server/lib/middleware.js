const async = require('async');

/**
 * @var {object} - Middlewares list.
 */
let middlewares = {};

/**
 * Add a middleware.
 * @param {string} eventName - Name of the event.
 * @param {function} method - Method to call when the event is fired.
 */
const add = (eventName, method) => {
  if (typeof middlewares[eventName] === 'undefined') {
    middlewares[eventName] = [];
  }
  middlewares[eventName].push(method);
};

/**
 * Trigger an event.
 * @param {string} eventName - Name of the event.
 * @param {object} parameters - Parameters to send to the listeners.
 * @param {requestCallback} callback
 */
const on = (eventName, parameters, callback) => {
  if (middlewares[eventName] === 'undefined') {
    callback(null, parameters);
    return;
  }

  let mutableParameters = Object.assign({}, parameters);

  async.eachSeries(middlewares[eventName], (method, next) => {
    method(mutableParameters, (err, result) => {
      mutableParameters = result;
      next(err);
    });
  }, (err) => {
    callback(err, mutableParameters);
  });
};

/**
 * Remove all middlewares.
 * Only used for testing.
 */
const clearAll = () => {
  middlewares = {};
};


module.exports = {
  add,
  on,
  clearAll,
};
