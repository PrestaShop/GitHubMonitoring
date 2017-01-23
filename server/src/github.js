import https from 'https';
import querystring from 'querystring';
import { whilst } from 'async';
import github from '../config';

const getFromGitHubApi = (path, parameters, callback) => {
  https.request({
    hostname: 'api.github.com',
    port: 443,
    path: `${path}?${querystring.stringify(parameters)}`,
    auth: `${github.username}:${github.key}`,
    method: 'GET',
    headers: {
      'User-Agent': github.agent,
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

export const getApiRatioRemaining = (callback) => {
  getFromGitHubApi('/rate_limit', {}, (err, result) => {
    callback(err, result.resources.core.remaining);
  });
};

export const getAllPullRequests = (callback) => {
  const path = '/repos/PrestaShop/PrestaShop/pulls';
  const pullRequests = [];
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
      result.forEach((pullRequest) => {
        let monitoredBase = false;
        github.bases.forEach((base) => {
          if (pullRequest.base.ref === base) {
            monitoredBase = true;
          }
        });
        if (monitoredBase) {
          const pullRequestDate = new Date(pullRequest.created_at);
          const newPullRequest = {
            number: pullRequest.number,
            base: pullRequest.base.ref,
            state: pullRequest.state,
            created_at: pullRequestDate.getTime(),
            lastUpdate: Date.now(),
            from: pullRequest.user.login,
          };
          if (pullRequest.assignee !== null) {
            newPullRequest.assignee = {
              name: pullRequest.assignee.login,
              avatar_url: pullRequest.assignee.avatar_url,
            };
          }
          pullRequests.push(newPullRequest);
        }
      });
      next(null);
    });
  };

  const whilstCallback = (error) => {
    callback(error, pullRequests);
  };

  whilst(whilstTest, whilstIteratee, whilstCallback);
};

export const getPullRequest = (number, callback) => {
  const path = `/repos/PrestaShop/PrestaShop/issues/${number}/comments`;
  const parameters = {
    per_page: 100,
  };
  getFromGitHubApi(path, parameters, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const comments = [];
      result.forEach((comment) => {
        const commentDate = new Date(comment.created_at);
        comments.push({
          body: comment.body,
          login: comment.user.login,
          avatar: comment.user.avatar_url,
          created_at: commentDate.getTime(),
        });
      });
      callback(null, comments);
    }
  });
};
