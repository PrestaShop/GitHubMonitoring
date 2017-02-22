const fs = require('fs');
const path = require('path');
const distConfiguration = require('./configuration.dist');

const localConfigurationPath = path.resolve(__dirname, 'configuration.local.json');
if (fs.existsSync(localConfigurationPath)) {
  const localConfiguration = JSON.parse(fs.readFileSync(localConfigurationPath, 'utf8'));
  const mergedConfiguration = {
    github: {},
    server: {},
    display: {},
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
