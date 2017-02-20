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
  async.waterfall([
    (next) => {
      githubApi.setSettings(configuration.github, next);
    },
    (next) => {
      const pulls = [];
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
              pulls.push(pull);
            });
            whilstNext();
          });
        },
        () => pulls.length === page * 100,
        (err) => {
          next(err, pulls);
        },
      );
    },
    (pulls, next) => {
      githubApi.getMergedPullRequests(configuration.display.merged_display_time, (err, result) => {
        if (err) {
          next(err);
          return;
        }
        result.forEach((pull) => {
          pulls.push(pull);
        });
        next(null, pulls);
      });
    },
    (issues, next) => {
      async.each(
        issues,
        (issueData, nextEach) => {
          const newIssue = issue.getNew();
          issue.extractPullData(newIssue, issueData, (err, finalIssue) => {
            if (err) {
              nextEach(err);
              return;
            }
            issuesContainer.addIssue(finalIssue);
            nextEach();
          });
        },
        next,
      );
    },
    (next) => {
      const issues = issuesContainer.getIssues();
      async.each(
        issues,
        (currentIssue, nextEach) => {
          githubApi.getComments(
            currentIssue.number,
            Math.floor(currentIssue.comments / 10),
            (err, commentsData) => {
              if (err) {
                nextEach(err);
                return;
              }
              issue.extractCommentsData(currentIssue, commentsData, (extractErr, finalIssue) => {
                if (err) {
                  nextEach(err);
                  return;
                }
                issuesContainer.addIssue(finalIssue);
                nextEach();
              });
            },
          );
        },
        (err) => {
          next(err, issuesContainer.getIssues());
        },
      );
    },
  ], callback);
};

module.exports = fetchData;
