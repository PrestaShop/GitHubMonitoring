const path = require('path');
const async = require('async');
const event = require('../lib/event');
const issue = require('../lib/issue');
const colors = require('colors');
const issuesContainer = require('../lib/issuesContainer');
const githubApi = require('../lib/githubApi');

/**
 * @var {Array} - Array containing exported routes.
 */
const routes = [];

// Route used to return static files to the clients.
routes.push({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply.file(path.resolve(__dirname, '../../public/index.html'), { confine: false });
  },
});

// Route called when a client is connected via websocket.
routes.push({
  method: 'GET',
  path: '/ws',
  config: {
    id: 'connection',
    handler: (request, reply) => {
      reply(issuesContainer.getIssues());
    },
  },
});

// Routes called by GitHub (WebHooks)
routes.push({
  method: 'POST',
  path: '/',
  handler: (request) => {
    const eventName = request.headers['x-github-event'];
    const eventBuilder = event.getFactoryForEventName(eventName);
    const eventData = request.payload;
    let currentEvent = null;
    let currentIssue = null;
    if (eventBuilder !== null) {
      async.waterfall([
        (next) => {
          eventBuilder(eventData, next);
        },
        (result, next) => {
          currentEvent = result;
          if (typeof currentEvent.body !== 'undefined' && currentEvent.body !== null) {
            githubApi.mdToHtml(currentEvent.body, next);
          } else {
            next(null, '');
          }
        },
        (result, next) => {
          currentEvent.body = result;
          request.server.broadcast({ event: currentEvent });
          if (currentEvent.number !== 'undefined' && currentEvent.number > 0) {
            githubApi.getPullRequest(currentEvent.number, next);
          }
        },
        (result, next) => {
          currentIssue = issuesContainer.getIssue(currentEvent.number);
          if (currentIssue === null) {
            currentIssue = issue.getNew();
          }
          issue.extractPullData(currentIssue, result, next);
        },
        (result, next) => {
          currentIssue = result;
          githubApi.getComments(result.number, Math.floor(result.comments / 10), next);
        },
        (result, next) => {
          issue.extractCommentsData(currentIssue, result, next);
        },
        (result) => {
          if (result.state === 'closed' && !result.merged) {
            issuesContainer.removeIssue(result);
          } else {
            issuesContainer.addIssue(result);
          }
          request.server.broadcast({ issue: result });
        },
      ]);
    } else {
      process.stdout.write(colors.yellow(`The event ${eventName} is not supported.\n`));
    }
  },
});

module.exports = routes;
