const eventToIssueData = require('../../lib/eventToIssueData');
const assert = require('chai').assert;
const defaultEventPullRequest = require('../resources/eventPullRequest');
const defaultEventIssueComment = require('../resources/eventIssueComment');

describe('eventToIssueData', () => {
  describe('#pullRequestEventToPull', () => {
    it('should not return an error', (done) => {
      eventToIssueData.pullRequestEventToPull(defaultEventPullRequest, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should return a correct JSON object', (done) => {
      eventToIssueData.pullRequestEventToPull(defaultEventPullRequest, (err, pull) => {
        assert.isObject(pull);
        assert.equal('Update the README with new information', pull.title);
        done();
      });
    });
  });
  describe('#issueCommentEventToCommentsList', () => {
    it('should not return an error', (done) => {
      eventToIssueData.issueCommentEventToCommentsList(defaultEventIssueComment, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should return a correct JSON array', (done) => {
      eventToIssueData.issueCommentEventToCommentsList(
        defaultEventIssueComment,
        (err, comments) => {
          assert.isArray(comments);
          assert.equal(1, comments.length);
          assert.equal('You are totally right! I\'ll get this fixed right away.', comments[0].body);
          done();
        },
      );
    });
  });
});
