const path = require('path');

const routes = [];

// Route used to return static files to the clients.
routes.push({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply.file(path.resolve(__dirname, '../../public/index.html'), { confine: false });
  },
});

module.exports = routes;
