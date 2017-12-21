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
