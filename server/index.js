import initDebug from 'debug';
import { MongoClient } from 'mongodb';
import { waterfall } from 'async';
import initDatabase from './src/database';
import fetch from './src/server/fetch';
import web from './src/server/web';

const debug = initDebug('src:server:web');
let mongoDb;

waterfall([
  (next) => {
    MongoClient.connect('mongodb://localhost:27017/monitoring', next);
  },
  (mongoDbConnexion, next) => {
    debug('Connected to MongoDb');
    mongoDb = mongoDbConnexion;
    initDatabase(mongoDb, next);
  },
  (next) => {
    debug('MongoDb initialized');
    fetch.inject('mongoDb', mongoDb);
    fetch.start();
    next();
  },
  (next) => {
    web.start(next);
  },
  (server, next) => {
    debug('Server running at port 3000');
    server.decorate('request', 'mongoDb', mongoDb);
    next();
  },
], (err) => {
  debug('Initialization finished, start fetching process.');
  if (err) {
    throw err;
  }
});
