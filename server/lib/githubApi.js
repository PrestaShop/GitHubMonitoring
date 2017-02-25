const async = require('async');
const joi = require('joi');
const request = require('request');
const dateformat = require('dateformat');

/**
 * @var {object} - Defined settings.
 */
let definedSettings = {};

/**
 * Validate the settings object.
 * @param {Object} settings - Settings to validate.
 * @param {requestCallback} callback
 */
const validateSettings = (settings, callback) => {
  joi.validate(settings, joi.object().keys({
    agent: joi.string().required().min(1),
    username: joi.string().required().min(1),
    key: joi.string().required().min(1),
    repository: joi.string().required().min(1),
    bases: joi.array().required().items(joi.string()).min(1),
  }), (err) => {
    callback(err);
  });
};

/**
 * Do a request to the GitHub API.
 * @param {path} path - Path to call.
 * @param {requestCallback} callback
 */
const get = (path, callback) => {
  async.waterfall([
    (next) => {
      validateSettings(definedSettings, next);
    },
    (next) => {
      request({
        method: 'GET',
        url: `https://api.github.com${path}`,
        auth: {
          user: definedSettings.username,
          pass: definedSettings.key,
        },
        headers: {
          'User-Agent': definedSettings.agent,
        },
      }, (err, response, body) => {
        if (err) {
          next(err);
        } else {
          next(null, JSON.parse(body));
        }
      });
    },
  ], callback);
};

/**
 * Return a list of open pull requests.
 * (100 items per page)
 * @param {int} page - Page to fetch.
 * @param {requestCallback} callback
 */
const getOpenPullRequests = (page, callback) => {
  let bases = '';
  definedSettings.bases.forEach((base) => {
    bases += `+base:${base}`;
  });
  get(
    `/search/issues?q=type:pr+repo:${definedSettings.repository}${bases}+is:open&per_page=100&page=${page}`,
    (err, result) => {
      if (err || typeof result.errors !== 'undefined') {
        callback(err || result.errors[0].message);
      } else {
        callback(null, result.items);
      }
    },
  );
};

/**
 * Return a list of open pull requests for a span of hours.
 * (Maximum 100)
 * @param {int} hours - Hours span for the merged forced display.
 * @param {requestCallback} callback
 */
const getMergedPullRequests = (hours, callback) => {
  let bases = '';
  definedSettings.bases.forEach((base) => {
    bases += `+base:${base}`;
  });
  const date = dateformat(new Date(Date.now() - (hours * 3600 * 1000)), 'yyyy-mm-dd\'T\'HH:MM:ss');
  get(
    `/search/issues?q=type:pr+repo:${definedSettings.repository}${bases}+merged:>=${date}&per_page=100`,
    (err, result) => {
      if (err || typeof result.errors !== 'undefined') {
        callback(err || result.errors[0].message);
      } else {
        callback(null, result.items);
      }
    },
  );
};

/**
 * Return a single pull request.
 * @param {int} number - Pull request number.
 * @param {requestCallback} callback
 */
const getPullRequest = (number, callback) => {
  get(`/repos/${definedSettings.repository}/pulls/${number}`, (err, result) => {
    if (err || typeof result.errors !== 'undefined') {
      callback(err || result.errors[0].message);
    } else {
      callback(null, result);
    }
  });
};

/**
 * Return a comment page of a single pull request.
 * (Containing 10 items.)
 * @param {int} number - Pull request number.
 * @param {int} page - Comments page number.
 * @param {requestCallback} callback
 */
const getComments = (number, page, callback) => {
  get(
    `/repos/${definedSettings.repository}/issues/${number}/comments?per_page=10&page=${page}`,
    callback,
  );
};

/**
 * Transpile Markdown text to HTML via the GitHub Api.
 * @param {string} md - Markdown text to transpile.
 * @param {requestCallback} callback
 */
const mdToHtml = (md, callback) => {
  request({
    method: 'POST',
    url: 'https://api.github.com/markdown',
    auth: {
      user: definedSettings.username,
      pass: definedSettings.key,
    },
    headers: {
      'User-Agent': definedSettings.agent,
    },
    json: {
      text: md,
      mode: 'gfm',
      context: definedSettings.repository,
    },
  }, (err, response, body) => {
    callback(err, body);
  });
};

/**
 * Set the needed settings for calling the GitHub API.
 * @param {Object} settings - Settings to define.
 * @param {requestCallback} callback
 */
const setSettings = (settings, callback) => {
  validateSettings(settings, (err) => {
    if (err) {
      callback(err);
    } else {
      definedSettings = Object.assign({}, settings);
      callback(null);
    }
  });
};

module.exports = {
  getOpenPullRequests,
  getMergedPullRequests,
  getPullRequest,
  getComments,
  mdToHtml,
  setSettings,
};
