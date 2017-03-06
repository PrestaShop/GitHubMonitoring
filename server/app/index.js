const createServer = require('../lib/server').create;
const configuration = require('../configuration');
const fetchData = require('./fetchData');
const routes = require('./routes');
const async = require('async');
const colors = require('colors');

async.waterfall([
  (next) => {
    process.stdout.write(colors.gray('Fetching issues…\n'));
    fetchData(next);
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
  (server, next) => {
    server.route(routes);
    process.stdout.write(colors.green(`Server correctly started and listen for ${configuration.server.port}\n`));
    next();
  },
], (err) => {
  if (err) {
    throw err;
  }
});
