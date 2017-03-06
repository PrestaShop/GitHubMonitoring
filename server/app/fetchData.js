const async = require('async');
const githubApi = require('../lib/githubApi');
const issue = require('../lib/issue');
const issuesContainer = require('../lib/issuesContainer');
const configuration = require('../configuration');

/**
 * Fetch all open pull requests.
 * @param {requestCallback} callback
 */
const fetchOpenPullRequests = (callback) => {
  const issues = [];
  let page = 0;
  async.doWhilst(
    (next) => {
      page += 1;
      githubApi.getOpenPullRequests(page, (err, result) => {
        if (err) {
          next(err);
          return;
        }
        result.forEach((pull) => {
          issues.push(pull.number);
        });
        next();
      });
    },
    () => issues.length === page * 100,
    (err) => {
      callback(err, issues);
    },
  );
};

/**
 * Fetch all merged pull requests.
 * @param {issues} issues - Current fetched issues
 * @param {requestCallback} callback
 */
const fetchMergedPullRequests = (issues, callback) => {
  githubApi.getMergedPullRequests(configuration.display.merged_display_time, (err, result) => {
    if (!err) {
      result.forEach((pull) => {
        issues.push(pull.number);
      });
    }
    callback(err, issues);
  });
};

/**
 * Fetch all pull requests data.
 * @param {issues} issues - Current fetched issues
 * @param {requestCallback} callback
 */
const fetchPullRequestsData = (issues, callback) => {
  async.each(
    issues,
    (number, nextEach) => {
      let newIssue = issue.getNew();
      async.waterfall([
        (next) => {
          githubApi.getPullRequest(number, next);
        },
        (result, next) => {
          issue.extractPullData(newIssue, result, next);
        },
        (result, next) => {
          newIssue = result;
          githubApi.getComments(number, Math.floor(newIssue.comments / 10), next);
        },
        (result, next) => {
          issue.extractCommentsData(newIssue, result, next);
        },
        (result, next) => {
          issuesContainer.addIssue(result);
          next();
        },
      ], nextEach);
    },
    (err) => {
      callback(err, issuesContainer.getIssues());
    },
  );
};

/**
 * Fetch all the needed data from the GitHub API.
 * @param {object} configuration - Application configuration.
 * @param {requestCallback} callback
 */
const fetchData = (callback) => {
  async.waterfall([
    async.apply(githubApi.setSettings, configuration.github),
    fetchOpenPullRequests,
    fetchMergedPullRequests,
    fetchPullRequestsData,
  ], callback);
};

module.exports = fetchData;
