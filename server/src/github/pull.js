import { getAllPullRequests, getPullRequestLastComments } from './api';

/**
 * Return monitoring data of a pull request.
 * @param {object} pull - Pull request.
 * @return {object} - Updated pull request.
 */
const getMonitoringData = (pull) => {
  const monitoring = {
    last_update: Date.now(),
  };

  if (pull.comments) {
    monitoring.visible = true;
  }
  return monitoring;
};

/**
 * Return all pull requests with the necessary data.
 * @param {requestCallback} callback
 */
export const getPulls = (callback) => {
  getAllPullRequests((err, result) => {
    if (err) {
      callback(err);
      return;
    }
    const pulls = [];
    result.forEach((pull) => {
      pulls.push({ number: pull.number, pull, monitoring: getMonitoringData(pull) });
    });
    callback(null, pulls);
  });
};

/**
 * Return a pull request updated with the comments.
 * @param {object} pull - Pull request to update with the comments.
 * @param {requestCallback} callback
 */
export const getPullWithComments = (pull, callback) => {
  getPullRequestLastComments(pull.number, (err, comments) => {
    if (err) {
      callback(err);
      return;
    }
    const monitoring = getMonitoringData(Object.assign({}, pull, { comments }));
    callback(null, Object.assign({}, pull, { comments, monitoring }));
  });
};
