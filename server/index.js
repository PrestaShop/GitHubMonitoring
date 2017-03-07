const middleware = require('./lib/middleware');
const initServer = require('./app/initServer');

middleware.add('pullFetched', (parameters, callback) => {
  const returnedParameters = Object.assign({}, parameters);
  const body = returnedParameters.pull.body;
  const regexp = new RegExp(/Description.*?\|(.*?)(\n|\r)/, 'g');
  const regexpResult = regexp.exec(body);
  returnedParameters.pull.body = regexpResult === null
    ? body
    : regexpResult[0];
  callback(null, returnedParameters);
});

initServer();
