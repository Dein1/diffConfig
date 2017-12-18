import fs from 'fs';

const file1 = JSON.parse(fs.readFileSync('./__tests__/__fixtures__/before.json'));
const file2 = JSON.parse(fs.readFileSync('./__tests__/__fixtures__/after.json'));

export default () => {
  console.log('hello!');
  console.log(file1);
  console.log(file2);
  console.log(file1.host);
  return true;
};
