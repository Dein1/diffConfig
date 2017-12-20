import { diff, compare } from '../src';

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

test('flat ini files', () => {
  const config1 = '__tests__/__fixtures__/before.ini';
  const config2 = '__tests__/__fixtures__/after.ini';
  expect(diff(config1, config2)).toMatch(`{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`);
});

test('compare - ast', () => {
  const data1 = { host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22' };
  const data2 = { timeout: 20, verbose: true, host: 'hexlet.io' };
  expect(compare(data1, data2)).toEqual([
    { name: 'host', value: 'hexlet.io', action: 'unchanged' },
    { name: 'timeout', value: 20, action: 'added' },
    { name: 'timeout', value: 50, action: 'removed' },
    { name: 'proxy', value: '123.234.53.22', action: 'removed' },
    { name: 'verbose', value: true, action: 'added' },
  ]);
});

