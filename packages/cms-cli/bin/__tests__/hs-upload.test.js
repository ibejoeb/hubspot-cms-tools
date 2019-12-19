/**
 * @jest-environment ./CommandTestEnvironment.js
 */

// const path = require('path');
const { node: execNode } = require('execa');

const {
  hsPath,
  hscmsPath,
  // remoteRoot,
  // localTestDir
} = global;

console.log(hsPath);

const testEach = test.each`
  exe        | script
  ${'hs'}    | ${hsPath}
  ${'hscms'} | ${hscmsPath}
`;

testEach('$exe upload --help', async ({ script }) => {
  const { stdout } = await execNode(script, ['upload', '--help']);
  expect(stdout).toMatchSnapshot();
});

// testEach('$exe upload (missing src)', async ({ script }) => {
//   let stderr;
//   try {
//     await execNode(script, ['upload']);
//   } catch (err) {
//     ({ stderr } = err);
//   }
//   expect(stderr).toBeTruthy();
// });

// testEach('$exe upload --portal=invalid', async ({ script }) => {
//   let stderr;
//   try {
//     await execNode(script, ['upload', '--portal=invalid']);
//   } catch (err) {
//     ({ stderr } = err);
//   }
//   expect(stderr).toBeTruthy();
// });

// testEach(`$exe upload ${remoteRoot}/js`, async ({ script }) => {
//   const src = `${remoteRoot}/js`;
//   const dest = path.join(localTestDir, 'foo');
//   const { stdout } = await execNode(script, ['upload', src, dest]);
//   expect(stdout).toBeTruthy();
// });

// testEach('$exe upload /does-not-exist', async ({ script }) => {
//   const src = '/does-not-exist';
//   const dest = localTestDir;
//   const { stderr } = await execNode(script, ['upload', src, dest]);
//   expect(stderr).toBeTruthy();
// });
