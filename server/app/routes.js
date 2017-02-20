const path = require('path');
const issuesContainer = require('../lib/issuesContainer');

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

module.exports = routes;
