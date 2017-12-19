import diff from '../src';

test('flat json files', () => {
  const config1 = '__tests__/__fixtures__/before.json';
  const config2 = '__tests__/__fixtures__/after.json';
  expect(diff(config1, config2)).toMatch(`{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`);
});

test('flat yaml files', () => {
  const config1 = '__tests__/__fixtures__/before.yml';
  const config2 = '__tests__/__fixtures__/after.yml';
  expect(diff(config1, config2)).toMatch(`{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`);
});

