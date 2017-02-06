import initDebug from 'debug';
import Inert from 'inert';
import Hapi from 'hapi';

const debug = initDebug('src:server:web');
const server = new Hapi.Server();

/**
 * Initialize and start the web server.
 * @param {requestCallback} callback
 */
const start = (callback) => {
  server.register(Inert, () => {});
  server.connection({ port: 3000 });

  // Redirect to the root path if the request cannot be handled.
  server.ext('onPreResponse', (request, reply) => {
    debug(`GET ${request.path}`);
    if (request.response.isBoom) {
      return reply.redirect('/');
    }
    return reply.continue();
  });

  // Root path.
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.file('../public/index.html', { confine: false });
    },
  });

  // Path returning the data.
  server.route({
    method: 'GET',
    path: '/data.json',
    handler: (request, reply) => {
      const collection = request.mongoDb.collection('pullRequests');
      collection.find({
        $and: [
          { comments: { $exists: 1 } },
          {
            $or: [{
              'pull.state': 'open',
            }, {
              'pull.state': 'closed',
              'pull.merged_at': { $gt: new Date(Date.now() - (2 * 60 * 60 * 1000)).toISOString() },
            }],
          },
        ],
      }).sort({ number: -1 }).limit(150).toArray((err, result) => {
        reply(result);
      });
    },
  });

  // Path for all files unto the public folder.
  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: (request, reply) => {
      const parameters = request.params.file.split('/');
      let path = '../public/';
      parameters.forEach((value) => {
        const encodedUri = encodeURIComponent(value);
        path += `/${encodedUri}`;
      });
      reply.file(path, { confine: false });
    },
  });

  server.start((err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, server);
    }
  });
};

const index = {
  start,
};

export default index;
