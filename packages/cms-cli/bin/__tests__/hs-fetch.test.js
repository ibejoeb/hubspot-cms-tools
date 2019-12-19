/**
 * @jest-environment ./CommandTestEnvironment.js
 */

// const path = require('path');
const { node: execNode } = require('execa');

const {
  hsPath,
  hscmsPath,
  // remoteRoot,
  // localTestDir,
} = global;

const testEach = test.each`
  exe        | script
  ${'hs'}    | ${hsPath}
  ${'hscms'} | ${hscmsPath}
`;

testEach('$exe fetch --help', async ({ script }) => {
  try {
    const { stdout } = await execNode(script, ['fetch', '--help']);
    expect(stdout).toMatchSnapshot();
  } catch (err) {
    console.log(err.stderr);
  }
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

// testEach(`$exe fetch ${remoteRoot}/js`, async ({ script }) => {
//   try {
//   const src = `${remoteRoot}/js`;
//   const dest = path.join(localTestDir, 'foo');
//   const { stdout } = await execNode(script, ['fetch', src, dest]);
//   expect(stdout).toBeTruthy();
//   } catch (err) {
//     console.log(err.stderr)
//   }
// });

// testEach('$exe fetch /does-not-exist', async ({ script }) => {
//   const src = '/does-not-exist';
//   const dest = localTestDir;
//   const { stderr } = await execNode(script, ['fetch', src, dest]);
//   expect(stderr).toBeTruthy();
// });
