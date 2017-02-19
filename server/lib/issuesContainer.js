/**
 * @var {object} - Issues list.
 */
let issues = {};

/**
 * Add an issue to the list.
 * @param {object} issue - Issue to add.
 * @throws {Error}
 */
const addIssue = (issue) => {
  if (typeof issue !== 'object') {
    throw new Error('The issue is not an object');
  }
  if (typeof issue.number !== 'number') {
    throw new Error('The issue number is not invalid');
  }

  issues[issue.number] = issue;
};

/**
 * Clear all issues.
 * Used only for tests purpose.
 */
const clearAll = () => {
  issues = {};
};

/**
 * Return all issues.
 * @return {Array} - Issues list.
 */
const getIssues = () => {
  const issuesArray = [];
  Object.keys(issues).forEach((key) => {
    issuesArray.push(Object.assign({}, issues[key]));
  });
  return issuesArray;
};

module.exports = {
  addIssue,
  clearAll,
  getIssues,
};
