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

module.exports = {
  pullRequestEventToPull,
  issueCommentEventToCommentsList,
};
