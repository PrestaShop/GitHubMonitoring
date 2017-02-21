/**
 * @var {object} - Base object for returned events.
 */
const defaultEvent = {
  name: null,
  action: null,
  number: null,
  body: null,
};

/**
 * Create an event from a GitHub pull_request event.
 * @param {object} eventData - GitHub event data.
 * @param {requestCallback} callback
 */
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

/**
 * Create an event from a GitHub issue_comment event.
 * @param {object} eventData - GitHub event data.
 * @param {requestCallback} callback
 */
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

/**
 * Return the event factory for the sended event name.
 * @param {string} eventName - GitHub event name.
 * @return {function} - Function to call to create the event.
 */
const getFactoryForEventName = (eventName) => {
  switch (eventName) {
    case 'issue_comment':
      return createFromIssueComment;
    case 'pull_request':
      return createFromPullRequest;
    default:
      return null;
  }
};

module.exports = {
  createFromPullRequest,
  createFromIssueComment,
  getFactoryForEventName,
};
