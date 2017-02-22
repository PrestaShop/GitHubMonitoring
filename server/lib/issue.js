/**
 * @param {object} - Base issue used when a new one is requested.
 */
const defaultIssue = {
  number: null,
  state: null,
  title: null,
  body: null,
  user: {
    login: null,
    avatar_url: null,
  },
  assignee: {
    login: null,
    avatar_url: null,
  },
  merged: null,
  mergeable: null,
  merged_at: null,
  merged_by: {
    login: null,
    avatar_url: null,
  },
  last_comment: {
    user: {
      login: null,
      avatar_url: null,
    },
    created_at: null,
  },
  created_at: null,
  comments: 0,
  additions: 0,
  deletions: 0,
};

/**
 * Return a new issue.
 * @return {object} - New issue.
 */
const getNew = () => Object.assign({}, defaultIssue, {
  user: Object.assign({}, defaultIssue.user),
  assignee: Object.assign({}, defaultIssue.assignee),
  merged_by: Object.assign({}, defaultIssue.merged_by),
  last_comment: Object.assign({}, defaultIssue.last_comment, {
    user: Object.assign({}, defaultIssue.last_comment.user),
  }),
});

/**
 * Extract the data from an API pull.
 * @param {object} baseIssue - Issue where the data are injected.
 * @param {object} data - Json data from the GitHub Api.
 * @param {requestCallback} callback
 */
const extractPullData = (baseIssue, data, callback) => {
  const issue = Object.assign({}, baseIssue);

  try {
    issue.number = data.number;
    issue.state = data.state;
    issue.title = data.title;
    issue.body = data.body;
    issue.merged = data.merged;
    issue.mergeable = data.mergeable;
    issue.merged_at = data.merged_at;
    issue.created_at = data.created_at;
    issue.comments = data.comments;
    issue.additions = data.additions;
    issue.deletions = data.deletions;

    issue.user.login = data.user.login;
    issue.user.avatar_url = data.user.avatar_url;

    if (typeof data.assignee !== 'undefined' && data.assignee !== null) {
      issue.assignee.login = data.assignee.login;
      issue.assignee.avatar_url = data.assignee.avatar_url;
    }

    if (typeof data.merged_by !== 'undefined' && data.merged_by !== null) {
      issue.merged_by.login = data.merged_by.login;
      issue.merged_by.avatar_url = data.merged_by.avatar_url;
    }
  } catch (err) {
    callback(err);
    return;
  }

  callback(null, issue);
};

/**
 * Extract the data from an API comments list.
 * @param {object} baseIssue - Issue where the data are injected.
 * @param {object} data - Json data from the GitHub Api.
 * @param {requestCallback} callback
 */
const extractCommentsData = (baseIssue, data, callback) => {
  const issue = Object.assign({}, baseIssue);

  if (data.length === 0) {
    callback(null, issue);
    return;
  }

  const lastComment = Object.assign({}, data[data.length - 1]);

  issue.last_comment.created_at = lastComment.created_at;
  issue.last_comment.user.login = lastComment.user.login;
  issue.last_comment.user.avatar_url = lastComment.user.avatar_url;

  callback(null, issue);
};

module.exports = {
  getNew,
  extractPullData,
  extractCommentsData,
};
