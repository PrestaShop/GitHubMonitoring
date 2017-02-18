const Hapi = require('hapi');
const Nes = require('nes');
const Inert = require('inert');
const githubApi = require('./src/githubApi');

const server = new Hapi.Server();
server.register(Inert, () => {});
server.connection({ port: 3000, routes: { cors: true } });

server.register(Nes, (err) => {
  server.route([{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.file('../public/index.html', { confine: false });
    },
  }, {
    method: 'GET',
    path: '/ws',
    config: {
      id: 'connection',
      handler: function (request, reply) {
        githubApi.getData((err, result) => {
          if (!err) {
            reply(result);
          }
        });
      },
    },
  }, {
    method: 'POST',
    path: '/',
    handler: (request, reply) => {
      if (typeof request.payload.action !== 'undefined') {
        switch (request.payload.action) {
          case 'assigned':
            server.broadcast({
              is_event: true,
              type: 'assigned',
              number: request.payload.number,
              assignee_avatar: request.payload.pull_request.assignee.avatar_url,
            });
            break;
          case 'unassigned':
            server.broadcast({
              is_event: true,
              type: 'unassigned',
              number: request.payload.number,
              assignee_avatar: null,
            });
            break;
          case 'closed':
            server.broadcast({
              is_event: true,
              type: 'closed',
              number: request.payload.number,
              title: request.payload.pull_request.title,
              merged: request.payload.pull_request.merged_at !== null,
              merged_at: typeof request.payload.pull_request.merged_at !== null
                ? request.payload.pull_request.merged_at
                : (new Date(0)).toISOString(),
              merged_by_avatar: request.payload.pull_request.user.avatar_url,
            });
            break;
          case 'started':
            server.broadcast({
              is_event: true,
              type: 'started',
              user: request.payload.sender.login,
              user_avatar: request.payload.sender.avatar_url,
            });
            break;
          case 'opened':
            githubApi.mdToHtml(request.payload.pull_request.body, (err, result) => {
              if (!err) {
                server.broadcast({
                  is_event: true,
                  type: 'opened',
                  number: request.payload.number,
                  user: request.payload.pull_request.user.login,
                  user_avatar: request.payload.pull_request.user.avatar_url,
                  title: request.payload.pull_request.title,
                  created_at: request.payload.pull_request.created_at,
                  body: result,
                });
              };
            });
            break;
          case 'created':
            githubApi.mdToHtml(request.payload.comment.body, (err, result) => {
              if (!err) {
                server.broadcast({
                  is_event: true,
                  type: 'created',
                  number: request.payload.issue.number,
                  last_comment_user: request.payload.comment.user.login,
                  last_comment_user_avatar: request.payload.comment.user.avatar_url,
                  last_comment_date: request.payload.comment.created_at,
                  body: result,
                });
              };
            });
            break;
        }
      }
    },
  }]);
});

server.start((err) => {
  if (err) {
    console.log('The server cannot start.');
  } else {
    console.log('Server correctly started and listen for 3000');
  }
});
