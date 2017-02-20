const issue = require('../../lib/issue');
const assert = require('chai').assert;
const defaultApiPull = require('../resources/apiPull');
const defaultApiComments = require('../resources/apiComments');

describe('issue', () => {
  describe('#getNew', () => {
    it('should return a new issue', () => {
      const newIssue = issue.getNew();
      assert.isObject(newIssue);
    });
    it('should return an imutable object', () => {
      const newIssue1 = issue.getNew();
      const newIssue2 = issue.getNew();
      assert.equal(false, newIssue1 === newIssue2);
    });
  });
  describe('#extractPullData', () => {
    let testedIssue;
    it('should not return an error', (done) => {
      const newIssue = issue.getNew();
      issue.extractPullData(newIssue, defaultApiPull, (err, result) => {
        assert.isNull(err);
        testedIssue = result;
        done();
      });
    });
    it('should return a imutable object', (done) => {
      const newIssue = issue.getNew();
      issue.extractPullData(newIssue, defaultApiPull, (err, result) => {
        assert.equal(false, result === newIssue);
        done();
      });
    });
    it('should correctly extract the number of the pull', (done) => {
      assert.equal(1347, testedIssue.number);
      done();
    });
    it('should correctly extract the state of the pull', (done) => {
      assert.equal('open', testedIssue.state);
      done();
    });
    it('should correctly extract the title of the pull', (done) => {
      assert.equal('new-feature', testedIssue.title);
      done();
    });
    it('should correctly extract the body of the pull', (done) => {
      assert.equal('Please pull these awesome changes', testedIssue.body);
      done();
    });
    it('should correctly extract the assignee login of the pull', (done) => {
      assert.equal('octocat', testedIssue.assignee.login);
      done();
    });
    it('should correctly extract the assignee avatar of the pull', (done) => {
      assert.equal('https://github.com/images/error/octocat_happy.gif', testedIssue.assignee.avatar_url);
      done();
    });
    it('should correctly extract the creation date of the pull', (done) => {
      assert.equal('2011-01-26T19:01:12Z', testedIssue.created_at);
      done();
    });
    it('should correctly extract the merge date of the pull', (done) => {
      assert.equal('2011-01-26T19:01:12Z', testedIssue.merged_at);
      done();
    });
    it('should correctly extract the user login of the pull', (done) => {
      assert.equal('octocat', testedIssue.user.login);
      done();
    });
    it('should correctly extract the user avatar of the pull', (done) => {
      assert.equal('https://github.com/images/error/octocat_happy.gif', testedIssue.user.avatar_url);
      done();
    });
    it('should correctly extract the merge status of the pull', (done) => {
      assert.equal(false, testedIssue.merged);
      done();
    });
    it('should correctly extract the mergeable status of the pull', (done) => {
      assert.equal(true, testedIssue.mergeable);
      done();
    });
    it('should correctly extract the merger login of the pull', (done) => {
      assert.equal('octocat', testedIssue.merged_by.login);
      done();
    });
    it('should correctly extract the merger avatar of the pull', (done) => {
      assert.equal('https://github.com/images/error/octocat_happy.gif', testedIssue.merged_by.avatar_url);
      done();
    });
    it('should correctly extract the comments count of the pull', (done) => {
      assert.equal(10, testedIssue.comments);
      done();
    });
    it('should correctly extract the additions count of the pull', (done) => {
      assert.equal(100, testedIssue.additions);
      done();
    });
    it('should correctly extract the deletions count of the pull', (done) => {
      assert.equal(3, testedIssue.deletions);
      done();
    });
    it('should not return an error if the merger is invalid', (done) => {
      const apiPull = Object.assign({}, defaultApiPull);
      delete apiPull.merged_by;
      const newIssue = issue.getNew();
      issue.extractPullData(newIssue, apiPull, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should not return an error if the assignee is invalid', (done) => {
      const apiPull = Object.assign({}, defaultApiPull);
      delete apiPull.assignee;
      const newIssue = issue.getNew();
      issue.extractPullData(newIssue, apiPull, (err) => {
        assert.isNull(err);
        done();
      });
    });
  });
  describe('#extractComments', () => {
    let testedIssue;
    it('should not return an error', (done) => {
      const newIssue = issue.getNew();
      issue.extractCommentsData(newIssue, defaultApiComments, (err, result) => {
        assert.isNull(err);
        testedIssue = result;
        done();
      });
    });
    it('should return a imutable object', (done) => {
      const newIssue = issue.getNew();
      issue.extractCommentsData(newIssue, defaultApiComments, (err, result) => {
        assert.equal(false, result === newIssue);
        done();
      });
    });
    it('should correctly record the creation date', (done) => {
      assert.equal('2011-04-14T16:00:49Z', testedIssue.last_comment.created_at);
      done();
    });
    it('should correctly record the comment user login', (done) => {
      assert.equal('octocat2', testedIssue.last_comment.user.login);
      done();
    });
    it('should correctly record the comment user avatar', (done) => {
      assert.equal('https://github.com/images/error/octocat_happy.gif', testedIssue.last_comment.user.avatar_url);
      done();
    });
    it('should not return an error if the comments list is empty', (done) => {
      const newIssue = issue.getNew();
      issue.extractCommentsData(newIssue, [], (err) => {
        assert.isNull(err);
        done();
      });
    });
  });
});
