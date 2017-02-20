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
  mergedConfiguration.server = Object.assign(
    {},
    distConfiguration.server,
    localConfiguration.server,
  );
  mergedConfiguration.display = Object.assign(
    {},
    distConfiguration.display,
    localConfiguration.display,
  );
  module.exports = mergedConfiguration;
} else {
  module.exports = distConfiguration;
}
