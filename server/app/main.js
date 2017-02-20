const createServer = require('../lib/server').create;
const configuration = require('../configuration');
const fetchData = require('./fetchData');
const routes = require('./routes');
const async = require('async');
const colors = require('colors');

let server;

async.waterfall([
  (next) => {
    process.stdout.write(colors.gray('Fetching issues…\n'));
    fetchData(configuration, next);
  },
  (issues, next) => {
    process.stdout.write(colors.green(issues.length));
    process.stdout.write(' issue(s) found\n');
    next();
  },
  (next) => {
    process.stdout.write(colors.gray('Server initialization…\n'));
    createServer(configuration.server, next);
  },
  (result, next) => {
    server = result;
    process.stdout.write(colors.green(`Server correctly started and listen for ${configuration.server.port}\n`));
    next();
  },
  (next) => {
    server.route(routes);
    next();
  },
], (err) => {
  if (err) {
    throw err;
  }
});
