const path = require('path');
const fs = require('fs-extra');
const NodeEnvironment = require('jest-environment-node');
const { bin: binPaths } = require('./package.json');

const localDir = path.join(__dirname, 'local');
const configFilePath = path.join(__dirname, 'hubspot.config.yml');
const hsPath = path.join(__dirname, binPaths.hs);
const hscmsPath = path.join(__dirname, binPaths.hscms);

const configSource = ({ portalId, apiKey }) => `
defaultPortal: 'test'
useRawAssets: true
# defaultMode: 'publish'
portals:
  - name: 'test'
    portalId: ${portalId}
    env: 'PROD'
    authType: 'apikey'
    apiKey: '${apiKey}'
    useRawAssets: true
    # defaultMode: 'draft'
`;

class CommandTestEnvironment extends NodeEnvironment {
  /**
   * @override
   */
  async setup() {
    await super.setup();

    this.global.localDir = localDir;
    this.global.hsPath = hsPath;
    this.global.hscmsPath = hscmsPath;

    await fs.emptyDir(localDir);
    await fs.ensureFile(configFilePath);
    await fs.writeFile(configFilePath, configSource(this.global));

    this.cwd = process.cwd();
    process.chdir(localDir);
  }

  /**
   * @override
   */
  async teardown() {
    await fs.remove(localDir);
    await fs.remove(configFilePath);

    process.chdir(this.cwd);

    await super.teardown();
  }
}

module.exports = CommandTestEnvironment;
