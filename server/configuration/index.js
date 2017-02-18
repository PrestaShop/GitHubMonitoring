const distConfiguration = require('./configuration.dist');
const localConfiguration = require.resolve('./configuration.local') ? require('./configuration.local') : null;

if (localConfiguration) {
  module.exports = Object.assign({}, localConfiguration, distConfiguration);
} else {
  module.exports = distConfiguration;
}
