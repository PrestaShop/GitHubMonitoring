const async = require('async');
const githubApi = require('../lib/githubApi');
const issue = require('../lib/issue');
const issuesContainer = require('../lib/issuesContainer');

/**
 * Fetch all the needed data from the GitHub API.
 * @param {object} configuration - Application configuration.
 * @param {requestCallback} callback
 */
const fetchData = (configuration, callback) => {
  const issues = [];
  async.waterfall([
    (next) => {
      githubApi.setSettings(configuration.github, next);
    },
    (next) => {
      let page = 0;
      async.doWhilst(
        (whilstNext) => {
          page += 1;
          githubApi.getOpenPullRequests(page, (err, result) => {
            if (err) {
              whilstNext(err);
              return;
            }
            result.forEach((pull) => {
              issues.push(pull.number);
            });
            whilstNext();
          });
        },
        () => issues.length === page * 100,
        next,
      );
    },
    (next) => {
      githubApi.getMergedPullRequests(configuration.display.merged_display_time, (err, result) => {
        if (!err) {
          result.forEach((pull) => {
            issues.push(pull.number);
          });
        }
        next(err);
      });
    },
    (next) => {
      async.each(
        issues,
        (number, nextEach) => {
          let newIssue = issue.getNew();
          async.waterfall([
            (innerNext) => {
              githubApi.getPullRequest(number, innerNext);
            },
            (result, innerNext) => {
              issue.extractPullData(newIssue, result, innerNext);
            },
            (result, innerNext) => {
              newIssue = result;
              githubApi.getComments(number, Math.floor(newIssue.comments / 10), innerNext);
            },
            (result, innerNext) => {
              issue.extractCommentsData(newIssue, result, innerNext);
            },
            (result, innerNext) => {
              issuesContainer.addIssue(result);
              innerNext();
            },
          ], nextEach);
        },
        next,
      );
    },
    (next) => {
      next(null, issuesContainer.getIssues());
    },
  ], callback);
};

module.exports = fetchData;
