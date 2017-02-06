import initDebug from 'debug';
import { waterfall, each } from 'async';
import { settings } from '../../../package.json';
import { getPulls, getPull, getPullComments } from '../../github/api';

const debug = initDebug('src:server:fetch');
const dependencies = {};

/**
 * Update the pull requests list.
 * @param {object} mongoDb - MongoDb connexion to use.
 * @param {requestCallback} callback
 */
const updatePullRequestList = (callback = () => {}) => {
  const collection = dependencies.mongoDb.collection('pullRequests');
  waterfall([
    (next) => {
      getPulls(next);
    },
    (pulls, next) => {
      each(pulls, (pull, eachNext) => {
        const find = { number: pull.number };
        const update = {
          $set: {
            number: pull.number,
            date_update: new Date().toISOString(),
            pull,
          },
        };
        collection.update(find, update, { upsert: true }, eachNext, next);
      }, next);
    },
    (next) => {
      debug('All open pull requests updated');
      next();
    },
  ], callback);
};

/**
 * Update the oldest updated pull request.
 * @param {requestCallback} callback
 */
const updateOldestUpdatedPull = (callback = () => {}) => {
  const collection = dependencies.mongoDb.collection('pullRequests');
  let currentPull;
  waterfall([
    (next) => {
      collection.find({ 'pull.state': 'open' }, {}, { sort: 'date_update', limit: 1 }).nextObject(next);
    },
    (pull, next) => {
      if (pull) {
        currentPull = pull;
        getPull(currentPull.number, next);
      }
    },
    (pull, next) => {
      const pullUpdate = {
        $set: {
          pull,
          date_update: new Date().toISOString(),
        },
      };
      collection.update({ number: currentPull.number }, pullUpdate, next);
    },
    (result, next) => {
      getPullComments(currentPull.number, next);
    },
    (pullComments, next) => {
      const pullUpdate = {
        $set: {
          comments: pullComments,
          date_update: new Date().toISOString(),
        },
      };
      collection.update({ number: currentPull.number }, pullUpdate, next);
    },
    (result, next) => {
      debug(`Pull request ${currentPull.number} updated`);
      next();
    },
  ], (err) => {
    if (err) {
      debug(err);
    }
    callback(err);
  });
};

/**
 * Initialize the fetch server.
 */
const start = () => {
  if (!dependencies.mongoDb) {
    throw new Error('The mongoDb connexion is required');
  }

  setInterval(updatePullRequestList, settings.frequencies.updateAll * 1000);
  updatePullRequestList((err) => {
    if (err) {
      throw err;
    }
  });

  setInterval(updateOldestUpdatedPull, settings.frequencies.updateOne * 1000);
  updateOldestUpdatedPull((err) => {
    if (err) {
      throw err;
    }
  });

  // The fetch server should run non stop.
  const tick = () => {
    setImmediate(tick);
  };
  tick();
};

/**
 * Inject needed dependencies to the fetch server.
 * @param {string} name - Name of the parameter.
 * @param {mixed} value - Value to inject.
 */
const inject = (name, value) => {
  dependencies[name] = value;
};

/**
 * Export index.
 */
const index = {
  start,
  inject,
};
export default index;
