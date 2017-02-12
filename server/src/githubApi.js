const request = require('request');
const async = require('async');
const settings = require('../package.json').settings;

let pulls = [];
const defaultPull = {
  number: 0,
  user: null,
  assignee_avatar: null,
  merged: false,
  merged_at: (new Date(0)).toISOString(),
  merged_by: null,
  merged_by_avatar: null,
  last_comment_user: null,
  last_comment_date: (new Date(0)).toISOString(),
  created_at: (new Date(0)).toISOString(),
  comments: 0,
};

/**
 * Get a path from the GitHub API.
 * @param {path} path - Path to call.
 * @param {requestCallback} callback
 */
const get = (path, callback) => {
  request({
    method: 'GET',
    url: `https://api.github.com${path}`,
    auth: {
      user: settings.github.username,
      pass: settings.github.key,
    },
    headers: {
      'User-Agent': settings.github.agent,
    },
  }, (err, response, body) => {
    callback(err, JSON.parse(body));
  });
};

/**
 * Return a GitHub ISO formated date.
 * @return {string} - Formated date.
 */
const getISODate = () => {
  const date = new Date(Date.now() - (8 * 3600 * 1000));
  const day = date.getFullYear()
    + '-' + (date.getMonth() < 9 ? '0' : '' ) + (date.getMonth() + 1)
    + '-' +  (date.getDate() < 10 ? '0' : '' ) + date.getDate()
  const hour = (date.getHours() < 10 ? '0' : '') + date.getHours()
    + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    + ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  return `${day}T${hour}`;
};

const getOpenPullRequests = (page, callback) => {
  let bases = '';
  settings.github.bases.forEach((base) => {
    bases += `+base:${base}`;
  });
  get(
    `/search/issues?q=type:pr+repo:${settings.github.repository}${bases}+is:open&per_page=100&page=${page}`,
    (err, result) => {
      if (!err) {
        result.items.forEach((pull) => {
          pulls.push(Object.assign({}, defaultPull, {
            number: pull.number,
            assignee_avatar: pull.assignee !== null ? pull.assignee.avatar_url : null,
            user: pull.user.login,
            comments: pull.comments,
            created_at: pull.created_at,
          }));
        });
      }
      callback(err);
    }
  );
};

const getMergedPullRequests = (callback) => {
  let bases = '';
  settings.github.bases.forEach((base) => {
    bases += `+base:${base}`;
  });
  get(
    `/search/issues?q=type:pr+repo:${settings.github.repository}${bases}+merged:>=${getISODate()}&per_page=100`,
    (err, result) => {
      if (!err) {
        result.items.forEach((pull) => {
          pulls.push(Object.assign({}, defaultPull, {
            number: pull.number,
            assignee_avatar: pull.assignee !== null ? pull.assignee.avatar_url : null,
            user: pull.user.login,
            merged: true,
          }));
        });
      }
      callback(err);
    }
  );
};

const updatePullRequest = (number, callback) => {
  get(`/repos/${settings.github.repository}/pulls/${number}`, (err, result) => {
    if (!err) {
      pulls.forEach((pull) => {
        if (pull.number == number) {
          pull.merged_by = result.merged_by.login;
          pull.merged_by_avatar = result.merged_by.avatar_url;
          pull.merged_at = result.merged_at;
        }
      });
    }
    callback(err);
  });
};

const updateLastComment = (number, callback) => {
  let page;
  pulls.forEach((pull) => {
    if (pull.number == number) {
      page = Math.ceil(pull.comments / 100);
    }
  });
  get(`/repos/${settings.github.repository}/issues/${number}/comments?per_page=100&page=${page}`, (err, result) => {
    if (!err) {
      const comment = result.pop();
      pulls.forEach((pull) => {
        if (pull.number == number) {
          pull.last_comment_user = comment.user.login;
          pull.last_comment_date = comment.created_at;
        }
      });
    }
    callback(err);
  });
};

module.exports.mdToHtml = (md, callback) => {
  request({
    method: 'POST',
    url: `https://api.github.com/markdown`,
    auth: {
      user: settings.github.username,
      pass: settings.github.key,
    },
    headers: {
      'User-Agent': settings.github.agent,
    },
    json: {
      text: md,
      mode: 'gfm',
      context: settings.github.repository,
    },
  }, (err, response, body) => {
    callback(err, body);
  });
};

module.exports.getData = (callback) => {
  pulls = [];
  async.waterfall([
    (next) => {
      getOpenPullRequests(1, next);
    },
    (next) => {
      getOpenPullRequests(2, next);
    }, (next) => {
      getMergedPullRequests(next);
    }, (next) => {
      async.each(pulls, (pull, nextEach) => {
        if (pull.merged) {
          updatePullRequest(pull.number, nextEach);
        } else if (pull.comments > 0) {
          updateLastComment(pull.number, nextEach);
        } else {
          nextEach();
        }
      }, next);
    },
  ], (err, result) => {
    callback(err, pulls);
  });
};
