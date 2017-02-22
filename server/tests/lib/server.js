const server = require('../../lib/server');
const assert = require('chai').assert;

describe('server', () => {
  describe('#create', () => {
    it('should return an error if the port settings is missing', (done) => {
      server.create({ cors: false }, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should return an error if the cors settings is missing', (done) => {
      server.create({ port: 3333 }, (err) => {
        assert.isNotNull(err);
        done();
      });
    });
    it('should correctly create a server', (done) => {
      server.create({ port: 3333, cors: false }, (err, result) => {
        assert.isNull(err);
        assert.isObject(server);
        if (typeof result === 'object') {
          result.stop();
        }
        done();
      });
    });
  });
});
