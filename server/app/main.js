const createServer = require('../lib/server').create;
const configuration = require('../configuration');
const async = require('async');
const colors = require('colors');

let server;
async.waterfall([
  (next) => {
    createServer(configuration.server, next);
  },
  (result, next) => {
    server = result;
    process.stdout.write(colors.green(`Server correctly started and listen for ${configuration.server.port}\n`));
    next();
  },
], (err) => {
  if (err) {
    throw err;
  }
});
