const distConfiguration = require('./configuration.dist');
const localConfiguration = require.resolve('./configuration.local') ? require('./configuration.local') : null;

if (localConfiguration) {
  const mergedConfiguration = {
    github: {},
  };
  mergedConfiguration.github = Object.assign(
    {},
    distConfiguration.github,
    localConfiguration.github,
  );
  module.exports = mergedConfiguration;
} else {
  module.exports = distConfiguration;
}
