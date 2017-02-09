const http = require('http');

module.exports = (callback) => {
  http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/data.json',
    method: 'GET',
  }, (res) => {
    let result = '';
    res.setEncoding('utf8');
    res.on('data', (data) => {
      result += data;
    }).on('end', () => {
      callback(null, JSON.parse(result));
    });
  }).on('error', (error) => {
    callback(error);
  }).end();
};
