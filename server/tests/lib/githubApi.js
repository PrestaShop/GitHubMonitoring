const githubApi = require('../../lib/githubApi');
const assert = require('chai').assert;
const nock = require('nock');
const dateformat = require('dateformat');

const defaultSettings = {
  agent: 'Test agent',
  username: 'Shudrum',
  key: '1234567890',
  repository: 'Re/Po',
  bases: ['master'],
};

describe('githubApi', () => {
  beforeEach((done) => {
    githubApi.setSettings(defaultSettings, () => {
      done();
    });
  });
  describe('#setSettings', () => {
    let settings;
    beforeEach(() => {
      settings = Object.assign({}, defaultSettings);
    });
    it('should not work with a missing username settings', (done) => {
      delete settings.username;
      githubApi.setSettings(settings, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should not work with a missing agent settings', (done) => {
      delete settings.agent;
      githubApi.setSettings(settings, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should not work with a missing key settings', (done) => {
      delete settings.key;
      githubApi.setSettings(settings, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should not work with a missing repository settings', (done) => {
      delete settings.repository;
      githubApi.setSettings(settings, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should not work with a missing bases settings', (done) => {
      delete settings.bases;
      githubApi.setSettings(settings, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should not work with a empty bases settings', (done) => {
      settings.bases = [];
      githubApi.setSettings(settings, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should work with the correct settings', (done) => {
      githubApi.setSettings(settings, (err) => {
        assert.isNull(err);
        done();
      });
    });
  });
  describe('#getOpenPullRequests', () => {
    beforeEach(() => {
      nock('https://api.github.com')
        .get(uri => (uri.indexOf('&page=1') >= 0))
        .reply(200, {
          items: [
            { number: 1000 },
            { number: 2000 },
          ],
        });
    });
    it('should correctly call the API without error', (done) => {
      githubApi.getOpenPullRequests(1, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should correctly return an array', (done) => {
      githubApi.getOpenPullRequests(1, (err, result) => {
        assert.isArray(result);
        done();
      });
    });
    it('should correctly return the two elements', (done) => {
      githubApi.getOpenPullRequests(1, (err, result) => {
        assert.equal(2, result.length);
        assert.equal(1000, result[0].number);
        done();
      });
    });
    it('should correctly return the second page', (done) => {
      nock('https://api.github.com')
        .get(uri => (uri.indexOf('&page=2') >= 0))
        .reply(200, {
          items: [
            { number: 5000 },
          ],
        });
      githubApi.getOpenPullRequests(2, (err, result) => {
        assert.equal(1, result.length);
        assert.equal(5000, result[0].number);
        done();
      });
    });
  });
  describe('#getMergedPullRequests', () => {
    beforeEach(() => {
      nock('https://api.github.com')
        .get(uri => (uri.indexOf('merged') >= 0))
        .reply(200, {
          items: [
            { number: 1000 },
            { number: 2000 },
          ],
        });
    });
    it('should correctly call the API without error', (done) => {
      githubApi.getMergedPullRequests(1, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should correctly return an array', (done) => {
      githubApi.getMergedPullRequests(1, (err, result) => {
        assert.isArray(result);
        done();
      });
    });
    it('should correctly set the defined hour', (done) => {
      const date = dateformat(new Date(Date.now() - (5 * 3600 * 1000)), 'yyyy-mm-dd\'T\'HH:MM:ss');
      nock.cleanAll();
      nock('https://api.github.com')
        .get(uri => (uri.indexOf(date) >= 0))
        .reply(200, {
          items: [
            { number: 5000 },
            { number: 6000 },
            { number: 7000 },
          ],
        });
      githubApi.getMergedPullRequests(5, (err, result) => {
        assert.equal(3, result.length);
        assert.equal(7000, result[2].number);
        done();
      });
    });
  });
  describe('#getPullRequest', () => {
    beforeEach(() => {
      nock('https://api.github.com')
        .get(uri => (uri.indexOf('1234') >= 0))
        .reply(200, { number: 1000 });
    });
    it('should correctly call the API without error', (done) => {
      githubApi.getPullRequest(1234, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should correctly return an object', (done) => {
      githubApi.getPullRequest(1234, (err, result) => {
        assert.isObject(result);
        assert.isDefined(result.number);
        done();
      });
    });
  });
  describe('#getComments', () => {
    beforeEach(() => {
      nock('https://api.github.com')
        .get(uri => (uri.indexOf('2345') >= 0 && uri.indexOf('&page=1') >= 0))
        .reply(200, [
          { body: 'Comment 1' },
          { body: 'Comment 2' },
          { body: 'Comment 3' },
        ]);
    });
    it('should correctly call the API without error', (done) => {
      githubApi.getComments(2345, 1, (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should correctly return an array', (done) => {
      githubApi.getComments(2345, 1, (err, result) => {
        assert.isArray(result);
        done();
      });
    });
    it('should correctly return the second page', (done) => {
      nock('https://api.github.com')
        .get(uri => (uri.indexOf('2345') >= 0 && uri.indexOf('&page=2') >= 0))
        .reply(200, [
          { body: 'Comment second page' },
        ]);
      githubApi.getComments(2345, 2, (err, result) => {
        assert.isArray(result);
        assert.equal(1, result.length);
        assert.equal('Comment second page', result[0].body);
        done();
      });
    });
  });
  describe('#mdToHtml', () => {
    beforeEach(() => {
      nock('https://api.github.com')
        .post('/markdown', { text: '**Hello**' })
        .reply(200, '<b>Hello</b>');
    });
    it('should correctly call the API without error', (done) => {
      githubApi.mdToHtml('**Hello**', (err) => {
        assert.isNull(err);
        done();
      });
    });
    it('should correctly return a string', (done) => {
      githubApi.mdToHtml('**Hello**', (err, result) => {
        assert.isString(result);
        assert.equal('<b>Hello</b>', result);
        done();
      });
    });
  });
});
