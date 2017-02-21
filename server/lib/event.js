const defaultEvent = {
  name: null,
  action: null,
};

const createFromPullRequest = (eventData, callback) => {
  const newEvent = Object.assign({}, defaultEvent);

  try {
    newEvent.name = 'pull_request';
    newEvent.action = eventData.action;

    newEvent.number = eventData.pull_request.number;
    newEvent.title = eventData.pull_request.title;
    newEvent.body = eventData.pull_request.body;
    newEvent.additions = eventData.pull_request.additions;
    newEvent.deletions = eventData.pull_request.deletions;

    newEvent.user = {
      login: eventData.pull_request.user.login,
      avatar_url: eventData.pull_request.user.avatar_url,
    };

    if (eventData.pull_request.merged_by !== null) {
      newEvent.merged_by = {
        login: eventData.pull_request.merged_by.login,
        avatar_url: eventData.pull_request.merged_by.avatar_url,
      };
    } else {
      newEvent.merged_by = null;
    }
  } catch (err) {
    callback(err);
    return;
  }

  callback(null, newEvent);
};

const createFromIssueComment = (eventData, callback) => {
  const newEvent = Object.assign({}, defaultEvent);

  try {
    newEvent.name = 'issue_comment';
    newEvent.action = eventData.action;

    newEvent.number = eventData.issue.number;
    newEvent.title = eventData.issue.title;
    newEvent.body = eventData.issue.body;

    newEvent.user = {
      login: eventData.comment.user.login,
      avatar_url: eventData.comment.user.avatar_url,
    };

    newEvent.created_at = eventData.comment.created_at;
  } catch (err) {
    callback(err);
    return;
  }

  callback(null, newEvent);
};

module.exports = {
  createFromPullRequest,
  createFromIssueComment,
};
