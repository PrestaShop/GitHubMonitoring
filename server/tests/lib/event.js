const event = require('../../lib/event');
const assert = require('chai').assert;
const defaultEventPullRequest = require('../resources/eventPullRequest');
const defaultEventIssueComment = require('../resources/eventIssueComment');
const defaultEventWatch = require('../resources/eventWatch');
const defaultEventFork = require('../resources/eventFork');

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
    it('should correctly return a imutable event object', (done) => {
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
      assert.equal('You are totally right! I\'ll get this fixed right away.', newEvent.body);
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
  describe('#createFromWatch', () => {
    let newEvent;
    it('should return the event without error', (done) => {
      event.createFromWatch(defaultEventWatch, (err, result) => {
        assert.isNull(err);
        newEvent = result;
        done();
      });
    });
    it('should correctly return a imutable event object', (done) => {
      event.createFromWatch(defaultEventWatch, (err, otherEvent) => {
        assert.equal(false, newEvent === otherEvent);
        done();
      });
    });
    it('should correctly take the event name', (done) => {
      assert.equal('watch', newEvent.name);
      done();
    });
    it('should correctly take the event action', (done) => {
      assert.equal('started', newEvent.action);
      done();
    });
    it('should correctly take the user login', (done) => {
      assert.equal('baxterthehacker', newEvent.user.login);
      done();
    });
    it('should correctly take the user avatar_url', (done) => {
      assert.equal('https://avatars.githubusercontent.com/u/6752317?v=3', newEvent.user.avatar_url);
      done();
    });
    it('should correctly return an error if a parameter is missing', (done) => {
      const testEvent = Object.assign({}, defaultEventWatch);
      delete testEvent.sender;
      event.createFromWatch(testEvent, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
  });
  describe('#createFromFork', () => {
    let newEvent;
    it('should return the event without error', (done) => {
      event.createFromFork(defaultEventFork, (err, result) => {
        assert.isNull(err);
        newEvent = result;
        done();
      });
    });
    it('should correctly return a imutable event object', (done) => {
      event.createFromFork(defaultEventFork, (err, otherEvent) => {
        assert.equal(false, newEvent === otherEvent);
        done();
      });
    });
    it('should correctly take the event name', (done) => {
      assert.equal('fork', newEvent.name);
      done();
    });
    it('should correctly take the event action', (done) => {
      assert.equal('forkee', newEvent.action);
      done();
    });
    it('should correctly take the user login', (done) => {
      assert.equal('baxterandthehackers', newEvent.user.login);
      done();
    });
    it('should correctly take the user avatar_url', (done) => {
      assert.equal('https://avatars.githubusercontent.com/u/7649605?v=3', newEvent.user.avatar_url);
      done();
    });
    it('should correctly return an error if a parameter is missing', (done) => {
      const testEvent = Object.assign({}, defaultEventFork);
      delete testEvent.sender;
      event.createFromFork(testEvent, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
  });
  describe('#getFactoryForEventName', () => {
    it('should return the right function for the issue_comment event', () => {
      assert.equal(
        event.getFactoryForEventName('issue_comment').name,
        'createFromIssueComment',
      );
    });
    it('should return the right function for the pull_request event', () => {
      assert.equal(
        event.getFactoryForEventName('pull_request').name,
        'createFromPullRequest',
      );
    });
    it('should return the right function for the watch event', () => {
      assert.equal(
        event.getFactoryForEventName('watch').name,
        'createFromWatch',
      );
    });
    it('should return the right function for the fork event', () => {
      assert.equal(
        event.getFactoryForEventName('fork').name,
        'createFromFork',
      );
    });
    it('should return null if the event does not exists', () => {
      assert.isNull(event.getFactoryForEventName('nope'));
    });
  });
});
