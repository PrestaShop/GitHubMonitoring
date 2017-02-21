const event = require('../../lib/event');
const assert = require('chai').assert;
const defaultEventPullRequest = require('../resources/eventPullRequest');
const defaultEventIssueComment = require('../resources/eventIssueComment');

describe('event', () => {
  describe('#createFromPullRequest', () => {
    let newEvent;
    it('should return the event without error', (done) => {
      event.createFromPullRequest(defaultEventPullRequest, (err, result) => {
        assert.isNull(err);
        newEvent = result;
        done();
      });
    });
    it('should correctly a imutable event object', (done) => {
      event.createFromPullRequest(defaultEventPullRequest, (err, otherEvent) => {
        assert.equal(false, newEvent === otherEvent);
        done();
      });
    });
    it('should correctly take the event name', (done) => {
      assert.equal('pull_request', newEvent.name);
      done();
    });
    it('should correctly take the pull request number', (done) => {
      assert.equal(1, newEvent.number);
      done();
    });
    it('should correctly take the event action', (done) => {
      assert.equal('opened', newEvent.action);
      done();
    });
    it('should correctly take the event\'s pull request title', (done) => {
      assert.equal('Update the README with new information', newEvent.title);
      done();
    });
    it('should correctly take the event\'s pull request body', (done) => {
      assert.equal('This is a pretty simple change that we need to pull into master.', newEvent.body);
      done();
    });
    it('should correctly take the event\'s pull request additions', (done) => {
      assert.equal(1, newEvent.additions);
      done();
    });
    it('should correctly take the event\'s pull request deletions', (done) => {
      assert.equal(2, newEvent.deletions);
      done();
    });
    it('should correctly take the event\'s user login', (done) => {
      assert.equal('baxterthehacker', newEvent.user.login);
      done();
    });
    it('should correctly take the event\'s user avatar_url', (done) => {
      assert.equal('https://avatars.githubusercontent.com/u/6752317?v=3', newEvent.user.avatar_url);
      done();
    });
    it('should correctly take the event\'s merger login', (done) => {
      assert.equal('baxterthehacker2', newEvent.merged_by.login);
      done();
    });
    it('should correctly take the event\'s merger avatar_url', (done) => {
      assert.equal('https://avatars.githubusercontent.com/u/6752317?v=32', newEvent.merged_by.avatar_url);
      done();
    });
    it('should return an error if the merged_by parameter is missing', (done) => {
      const newEventPullRequest = Object.assign({}, defaultEventPullRequest);
      delete newEventPullRequest.pull_request.merged_by;
      event.createFromPullRequest(defaultEventPullRequest, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should not return an error if the merged_by parameter is null', (done) => {
      const newEventPullRequest = Object.assign({}, defaultEventPullRequest);
      newEventPullRequest.pull_request.merged_by = null;
      event.createFromPullRequest(defaultEventPullRequest, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should return merged_by:null if the merged_by parameter is null', (done) => {
      const newEventPullRequest = Object.assign({}, defaultEventPullRequest);
      newEventPullRequest.pull_request.merged_by = null;
      event.createFromPullRequest(defaultEventPullRequest, (err, result) => {
        assert.isNull(result.merged_by);
        done();
      });
    });
  });
  describe('#createFromIssueComment', () => {
    let newEvent;
    it('should return the event without error', (done) => {
      event.createFromIssueComment(defaultEventIssueComment, (err, result) => {
        assert.isNull(err);
        newEvent = result;
        done();
      });
    });
    it('should correctly a imutable event object', (done) => {
      event.createFromIssueComment(defaultEventIssueComment, (err, otherEvent) => {
        assert.equal(false, newEvent === otherEvent);
        done();
      });
    });
    it('should correctly take the event name', (done) => {
      assert.equal('issue_comment', newEvent.name);
      done();
    });
    it('should correctly take the event action', (done) => {
      assert.equal('created', newEvent.action);
      done();
    });
    it('should correctly take the pull request number', (done) => {
      assert.equal(2, newEvent.number);
      done();
    });
    it('should correctly take the pull request title', (done) => {
      assert.equal('Spelling error in the README file', newEvent.title);
      done();
    });
    it('should correctly take the pull request body', (done) => {
      assert.equal('It looks like you accidently spelled \'commit\' with two \'t\'s.', newEvent.body);
      done();
    });
    it('should correctly take the comment created_at', (done) => {
      assert.equal('2015-05-05T23:40:28Z', newEvent.created_at);
      done();
    });
    it('should return an error if the a parameter is missing', (done) => {
      const newEventIssueComment = Object.assign({}, defaultEventIssueComment);
      delete newEventIssueComment.issue.user.login;
      event.createFromPullRequest(newEventIssueComment, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
  });
});
