import diff from '../src';

const flatResult = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;

test('flat json files', () => {
  const config1 = '__tests__/__fixtures__/before.json';
  const config2 = '__tests__/__fixtures__/after.json';
  expect(diff(config1, config2)).toMatch(flatResult);
});

test('flat yaml files', () => {
  const config1 = '__tests__/__fixtures__/before.yml';
  const config2 = '__tests__/__fixtures__/after.yml';
  expect(diff(config1, config2)).toMatch(flatResult);
});

test('flat ini files', () => {
  const config1 = '__tests__/__fixtures__/before.ini';
  const config2 = '__tests__/__fixtures__/after.ini';
  expect(diff(config1, config2)).toMatch(flatResult);
});

const recursiveResult = `{
    common: {
        setting1: Value 1
      - setting2: 200
        setting3: true
      - setting6: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}`;

test('recursive json files', () => {
  const config1 = '__tests__/__fixtures__/before-recursive.json';
  const config2 = '__tests__/__fixtures__/after-recursive.json';
  expect(diff(config1, config2)).toMatch(recursiveResult);
});

test('recursive yaml files', () => {
  const config1 = '__tests__/__fixtures__/before-recursive.yml';
  const config2 = '__tests__/__fixtures__/after-recursive.yml';
  expect(diff(config1, config2)).toMatch(recursiveResult);
});

test('recursive ini files', () => {
  const config1 = '__tests__/__fixtures__/before-recursive.ini';
  const config2 = '__tests__/__fixtures__/after-recursive.ini';
  expect(diff(config1, config2)).toMatch(recursiveResult);
});

const plainResult = `Property 'common.setting2' was removed
Property 'common.setting6' was removed
Property 'common.setting4' was added with value: blah blah
Property 'common.setting5' was added with complex value
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group2' was removed
Property 'group3' was added with complex value
`;

test('recursive json files - plain', () => {
  const config1 = '__tests__/__fixtures__/before-recursive.json';
  const config2 = '__tests__/__fixtures__/after-recursive.json';
  expect(diff(config1, config2, 'plain')).toMatch(plainResult);
});

const jsonResult = '[{"name":"host","oldValue":"hexlet.io","newValue":"hexlet.io","type":"unchanged"},{"name":"timeout","oldValue":50,"newValue":20,"type":"changed"},{"name":"proxy","oldValue":"123.234.53.22","type":"removed"},{"name":"verbose","newValue":true,"type":"added"}]';
test('flat json => json', () => {
  const config1 = '__tests__/__fixtures__/before.json';
  const config2 = '__tests__/__fixtures__/after.json';
  expect(diff(config1, config2, 'json')).toMatch(jsonResult);
});
