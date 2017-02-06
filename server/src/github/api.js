import https from 'https';
import querystring from 'querystring';
import { whilst } from 'async';
import { settings } from '../../package.json';

/**
 * Fetch data from a path of the GitHub API.
 * @param {string} path - Path to fetch.
 * @param {object} parameters - List of parameters from the key / value pair of the object.
 * @param {requestCallback} callback
 */
const getFromGitHubApi = (path = '', parameters = {}, callback = () => {}) => {
  if (path === '') {
    callback('No path defined.');
    return;
  }
  https.request({
    hostname: 'api.github.com',
    port: 443,
    path: `${path}?${querystring.stringify(parameters)}`,
    auth: `${settings.github.username}:${settings.github.key}`,
    method: 'GET',
    headers: {
      'User-Agent': settings.github.agent,
    },
  }, (res) => {
    let result = '';
    res.setEncoding('utf8');
    res.on('data', (data) => {
      result += data;
    }).on('end', () => {
      callback(null, JSON.parse(result));
    });
  }).on('error', (error) => {
    callback(error);
  }).end();
};

/**
 * Get the remaining calls available for the configured user.
 * @param {requestCallback} callback
 */
export const getRatioRemaining = (callback) => {
  getFromGitHubApi('/rate_limit', {}, (err, result) => {
    callback(err, result.resources.core.remaining);
  });
};

/**
 * Get all the pull requests on the defined branches.
 * @param {requestCallback} callback
 */
export const getPulls = (callback) => {
  const path = `/repos/${settings.github.repository}/pulls`;
  const pulls = [];
  let lastCallLength = 0;
  let page = 0;

  const whilstTest = () => lastCallLength > 0 || page === 0;

  const whilstIteratee = (next) => {
    page += 1;
    const parameters = {
      state: 'open',
      page,
    };
    getFromGitHubApi(path, parameters, (err, result) => {
      lastCallLength = result.length;
      result.forEach((pull) => {
        if (settings.github.bases.indexOf(pull.base.ref) !== -1) {
          pulls.push(pull);
        }
      });
      next(null);
    });
  };

  const whilstCallback = (error) => {
    callback(error, pulls);
  };

  whilst(whilstTest, whilstIteratee, whilstCallback);
};

/**
 * Return the last comments of a pull request.
 * @param {requestCallback} callback
 */
export const getPullComments = (number, callback) => {
  const path = `/repos/${settings.github.repository}/issues/${number}/comments`;
  const parameters = {
    per_page: 100,
  };
  getFromGitHubApi(path, parameters, callback);
};

/**

 */
export const getPull = (number, callback) => {
  getFromGitHubApi(`/repos/${settings.github.repository}/pulls/${number}`, {}, callback);
};
