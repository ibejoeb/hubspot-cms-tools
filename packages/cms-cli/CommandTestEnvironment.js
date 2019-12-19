const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const NodeEnvironment = require('jest-environment-node');
const { createDirectory } = require('jest-util');
const { bin: binPaths } = require('./package.json');

const configSourceTemplate = ({ portalId, apiEnv, apiKey }) => `
defaultPortal: 'test'
useRawAssets: true
# defaultMode: 'publish'
portals:
  - name: 'test'
    portalId: ${portalId}
    env: '${apiEnv}'
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

    const tmpDir = os.tmpdir();
    const localTestDir = path.join(tmpDir, 'hubspot-cms-tools-command-tests');
    const configFilePath = path.join(tmpDir, 'hubspot.config.yml');
    const hsPath = path.join(__dirname, binPaths.hs);
    const hscmsPath = path.join(__dirname, binPaths.hscms);

    this.global.hsPath = hsPath;
    this.global.hscmsPath = hscmsPath;
    this.global.localTestDir = localTestDir;
    this.global.configFilePath = configFilePath;
    this.global.configSource = configSourceTemplate(this.global);

    createDirectory(localTestDir);
    await fs.emptyDir(localTestDir);
    await fs.ensureFile(configFilePath);
    await fs.writeFile(configFilePath, configSourceTemplate(this.global));
  }

  /**
   * @override
   */
  async teardown() {
    await super.teardown();
  }

  // runScript(script) {
  //   return super.runScript(script);
  // }
}

module.exports = CommandTestEnvironment;
