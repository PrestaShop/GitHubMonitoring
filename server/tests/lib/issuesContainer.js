const issuesContainer = require('../../lib/issuesContainer');
const assert = require('chai').assert;

describe('issuesContainer', () => {
  describe('#addIssue', () => {
    beforeEach(() => {
      issuesContainer.clearAll();
    });
    it('should add an issue without error', () => {
      assert.doesNotThrow(() => {
        issuesContainer.addIssue({ number: 1 });
      });
    });
    it('should have correctly added the issue', () => {
      issuesContainer.addIssue({ number: 2 });
      assert.equal(1, issuesContainer.getIssues().length);
    });
    it('should throw an error if the issue is not an object', () => {
      assert.throws(() => {
        issuesContainer.addIssue('issue');
      });
    });
    it('should throw an error if the issue does not have a number', () => {
      assert.throws(() => {
        issuesContainer.addIssue({ description: 'This is a issue' });
      });
    });
    it('should correctly add multiple issues', () => {
      issuesContainer.addIssue({ number: 2 });
      issuesContainer.addIssue({ number: 2 });
      issuesContainer.addIssue({ number: 3 });
      issuesContainer.addIssue({ number: 4 });
      issuesContainer.addIssue({ number: 5 });
      assert.equal(4, issuesContainer.getIssues().length);
    });
  });
  describe('#getIssues', () => {
    before(() => {
      issuesContainer.clearAll();
      issuesContainer.addIssue({ number: 1000, title: 'Number 1000' });
      issuesContainer.addIssue({ number: 1100, title: 'Number 1100' });
      issuesContainer.addIssue({ number: 1500, title: 'Number 1500' });
      issuesContainer.addIssue({ number: 1200, title: 'Number 1200' });
    });
    it('should return all issues as an array', () => {
      assert.isArray(issuesContainer.getIssues());
    });
    it('should return the issues correctly ordered', () => {
      const issues = issuesContainer.getIssues();
      assert.equal(1000, issues[0].number);
      assert.equal(1100, issues[1].number);
      assert.equal(1200, issues[2].number);
      assert.equal(1500, issues[3].number);
    });
    it('should return the issues imutable', () => {
      const issues = issuesContainer.getIssues();
      issuesContainer.addIssue({ number: 1000, title: 'Updated' });
      assert.equal('Number 1000', issues[0].title);
    });
  });
  describe('#clearAll', () => {
    before(() => {
      issuesContainer.clearAll();
    });
    it('should correclty clear the issues list', () => {
      issuesContainer.addIssue({ number: 1, title: '1' });
      issuesContainer.addIssue({ number: 2, title: '2' });
      issuesContainer.addIssue({ number: 3, title: '3' });
      issuesContainer.addIssue({ number: 4, title: '4' });
      issuesContainer.addIssue({ number: 5, title: '5' });
      issuesContainer.clearAll();
      assert.equal(0, issuesContainer.getIssues().length);
    });
  });
  describe('#count', () => {
    before(() => {
      issuesContainer.clearAll();
    });
    it('should return the correct amount of pulls when empty', () => {
      assert.equal(0, issuesContainer.count());
    });
    it('should return the correct amount of pulls when not empty', () => {
      issuesContainer.addIssue({ number: 1, title: '1' });
      issuesContainer.addIssue({ number: 2, title: '2' });
      issuesContainer.addIssue({ number: 3, title: '3' });
      assert.equal(3, issuesContainer.count());
    });
  });
  describe('#getIssue', () => {
    before(() => {
      issuesContainer.clearAll();
      issuesContainer.addIssue({ number: 1, title: 'Title 1' });
      issuesContainer.addIssue({ number: 2, title: 'Title 2' });
    });
    it('should return null if a issue does not exists', () => {
      const issue = issuesContainer.getIssue(3);
      assert.isNull(issue);
    });
    it('should return the correct issue', () => {
      const issue = issuesContainer.getIssue(2);
      assert.equal('Title 2', issue.title);
    });
    it('should return a imutable issue', () => {
      const issue1 = issuesContainer.getIssue(1);
      const issue2 = issuesContainer.getIssue(1);
      assert.equal(false, issue1 === issue2);
    });
  });
  describe('#removeIssue', () => {
    beforeEach(() => {
      issuesContainer.clearAll();
      issuesContainer.addIssue({ number: 1, title: 'Title 1' });
      issuesContainer.addIssue({ number: 2, title: 'Title 2' });
    });
    it('should correctly remove the issue', () => {
      issuesContainer.removeIssue({ number: 2, title: 'Title 2' });
      const allIssues = issuesContainer.getIssues();
      assert.equal(1, allIssues.length);
    });
    it('should correctly remove the right issue', () => {
      issuesContainer.removeIssue({ number: 1, title: 'Title 1' });
      const allIssues = issuesContainer.getIssues();
      assert.equal('Title 2', allIssues[0].title);
    });
    it('should not throw an error if the issue does not exists', () => {
      assert.doesNotThrow(() => {
        issuesContainer.removeIssue({ number: 4, title: 'Title 1' });
      });
    });
  });
});
