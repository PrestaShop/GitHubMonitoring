const middleware = require('../../lib/middleware');
const assert = require('chai').assert;

describe('middleware', () => {
  describe('#add', () => {
    it('should add a method without error', () => {
      assert.doesNotThrow(() => {
        middleware.add((callback) => { callback(null); });
      });
    });
  });
  describe('#clearAll', () => {
    it('should add a method without error', () => {
      assert.doesNotThrow(() => {
        middleware.clearAll();
      });
    });
  });
  describe('#on', () => {
    beforeEach(() => {
      middleware.clearAll();
    });
    it('shoud correctly execute a method', (done) => {
      middleware.add('testEvent', (parameters, callback) => {
        const newParameters = Object.assign({}, parameters);
        newParameters.total += 1;
        callback(null, newParameters);
      });
      middleware.on('testEvent', { total: 0 }, (err, result) => {
        assert.isNull(err);
        assert.equal(1, result.total);
        done();
      });
    });
    it('shoud correctly chain multiple methods', (done) => {
      middleware.add('testEvent', (parameters, callback) => {
        const newParameters = Object.assign({}, parameters);
        newParameters.total += 1;
        callback(null, newParameters);
      });
      middleware.add('testEvent', (parameters, callback) => {
        const newParameters = Object.assign({}, parameters);
        newParameters.total += 10;
        callback(null, newParameters);
      });
      middleware.on('testEvent', { total: 0 }, (err, result) => {
        assert.isNull(err);
        assert.equal(11, result.total);
        done();
      });
    });
  });
});
