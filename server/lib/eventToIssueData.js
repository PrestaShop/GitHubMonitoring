/**
 * Convert a Pull Request event to a pull request API data.
 * @param {object} pullRequestEventData - Pull request event data.
 * @param {requestCallback} callback
 */
const pullRequestEventToPull = (pullRequestEventData, callback) => {
  const pullData = Object.assign({}, pullRequestEventData.pull_request);
  callback(null, pullData);
};

/**
 * Convert a Issue Comment event to a comments list API data.
 * @param {object} pullRequestEventData - Issue comment event data.
 * @param {requestCallback} callback
 */
const issueCommentEventToCommentsList = (issueCommentEventData, callback) => {
  const comments = [
    Object.assign({}, issueCommentEventData.comment),
  ];
  callback(null, comments);
};

/**
 * Convert, if possible, a event content to a GitHub API data.
 * @param {string} eventName - Name of the event.
 * @param {data} object - Event data.
 * @param {requestCallback} callback
 */
const eventToApiData = (eventName, data, callback) => {
  switch (eventName) {
    case 'pull_request':
      pullRequestEventToPull(data, callback);
      break;
    case 'issue_comment':
      issueCommentEventToCommentsList(data, callback);
      break;
    default:
      callback(`The event ${eventName} is unknown.`);
  }
};

module.exports = {
  pullRequestEventToPull,
  issueCommentEventToCommentsList,
  eventToApiData,
};
