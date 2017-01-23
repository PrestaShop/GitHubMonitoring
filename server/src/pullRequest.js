import { waterfall } from 'async';
import { getAllPullRequests, getPullRequest } from './github';

export const updatePullRequestList = (mongoDb, callback) => {
  const collection = mongoDb.collection('pullRequests');
  waterfall([
    (next) => {
      getAllPullRequests(next);
    },
    (result, next) => {
      console.log(`${result.length} fetched.`);
      collection.insert(result, { ordered: false }, () => { next(null, result); });
    },
    (result, next) => {
      collection.update({}, { $set: { state: 'closed' } }, { multi: true }, (err) => { next(err, result); });
    },
    (result, next) => {
      result.forEach((pullRequest) => {
        collection.update({ number: pullRequest.number }, { $set: { state: 'open' } });
      });
      next();
    },
  ], (err) => {
    console.log(err);
    callback(err);
  });
};

export const updateLastPullRequest = (mongoDb, callback) => {
  const collection = mongoDb.collection('pullRequests');
  let pullRequestNumber;
  waterfall([
    (next) => {
      collection.findOne({ state: 'open' }, {}, { sort: [['lastUpdate', 'asc']] }, next);
    },
    (result, next) => {
      if (result === null) {
        next();
      } else {
        pullRequestNumber = result.number;
        console.log(`Update pull request #${pullRequestNumber}`);
        getPullRequest(pullRequestNumber, next);
      }
    },
    (result, next) => {
      if (result != null) {
        collection.update({
          number: pullRequestNumber,
        }, {
          $set: {
            lastUpdate: Date.now(),
            visible: true,
            comments: result,
          },
        }, next);
      } else {
        next(null, null);
      }
    },
  ], (err) => {
    callback(err);
  });
};

export const getAllData = (mongoDb, callback) => {
  const collection = mongoDb.collection('pullRequests');
  collection.find({
    state: 'open',
    visible: true,
  }).sort({ number: -1 }).limit(150).toArray(callback);
};
