/**
 * @jest-environment ./CommandTestEnvironment.js
 */

const path = require('path');
const { node: execNode } = require('execa');

const remoteRoot = 'cms-theme-boilerplate';

const { hsPath, hscmsPath, localDir } = global;

const testEach = test.each`
  exe        | script
  ${'hs'}    | ${hsPath}
  ${'hscms'} | ${hscmsPath}
`;

testEach('$exe fetch --help', async ({ script }) => {
  const { stdout } = await execNode(script, ['fetch', '--help']);
  expect(stdout).toMatchSnapshot();
});

testEach('$exe fetch (missing src)', async ({ script }) => {
  let stderr;
  try {
    await execNode(script, ['fetch']);
  } catch (err) {
    ({ stderr } = err);
  }
  expect(stderr).toBeTruthy();
});

testEach('$exe fetch --portal=invalid', async ({ script }) => {
  let stderr;
  try {
    await execNode(script, ['fetch', '--portal=invalid']);
  } catch (err) {
    ({ stderr } = err);
  }
  expect(stderr).toBeTruthy();
});

testEach(`$exe fetch ${remoteRoot}/js`, async ({ script }) => {
  const src = `${remoteRoot}/js`;
  const dest = path.join(localDir, 'foo');
  const { stdout } = await execNode(script, ['fetch', src, dest]);
  expect(stdout).toBeTruthy();
});

testEach('$exe fetch /does-not-exist', async ({ script }) => {
  const src = '/does-not-exist';
  const dest = localDir;
  const { stderr } = await execNode(script, ['fetch', src, dest]);
  expect(stderr).toBeTruthy();
});
