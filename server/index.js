import { MongoClient } from 'mongodb';
import { waterfall } from 'async';
import Inert from 'inert';
import Hapi from 'hapi';
import initDatabase from './src/database';
import { updatePullRequestList, getAllData, updateLastPullRequest } from './src/pullRequest';

let mongoDb;
const server = new Hapi.Server();

server.register(Inert, () => {});
server.connection({ port: 3000 });

server.ext('onPreResponse', (request, reply) => {
  if (request.response.isBoom) {
    return reply.redirect('/');
  }
  return reply.continue();
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply.file('../public/index.html', { confine: false });
  },
});

server.route({
  method: 'GET',
  path: '/data.json',
  handler: (request, reply) => {
    console.log('GET JSON');
    getAllData(mongoDb, (err, result) => {
      reply(result);
    });
  },
});

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
    throw err;
  }
  console.log('Server running at port 3000');
});

waterfall([
  (next) => {
    MongoClient.connect('mongodb://localhost:27017/monitoring', next);
  },
  (mongoDbConnexion, next) => {
    console.log('Connected to MongoDb');
    mongoDb = mongoDbConnexion;
    initDatabase(mongoDb, next);
  },
  (next) => {
    console.log('MongoDb initialized');
    next();
  },
], (err) => {
  if (err) {
    throw err;
  }
  console.log('Initialization finished, start fetching process.');

  setInterval(updatePullRequestList, 5 * 60 * 1000, mongoDb, () => {});
  updatePullRequestList(mongoDb, () => {});

  setInterval(updateLastPullRequest, 1000, mongoDb, () => {});

  const tick = () => {
    setImmediate(tick);
  };
  tick();
});
