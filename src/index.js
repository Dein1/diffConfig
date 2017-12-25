import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import render from './renderers/';
import parse from './parsers';

const compareActionMap = [
  {
    type: 'nested',
    check: (config1, config2, name) => (_.has(config1, name) && _.has(config2, name))
      && (_.isObject(config1[name]) && _.isObject(config2[name])),
    action: (value1, value2, f) => ({ children: f(value1, value2) }),
  },
  {
    type: 'unchanged',
    check: (config1, config2, name) => (_.has(config1, name) && _.has(config2, name))
      && (config1[name] === config2[name]),
    action: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
  {
    type: 'changed',
    check: (config1, config2, name) => (_.has(config1, name) && _.has(config2, name))
      && (config1[name] !== config2[name]),
    action: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
  {
    type: 'removed',
    check: (config1, config2, name) => _.has(config1, name) && !_.has(config2, name),
    action: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
  {
    type: 'added',
    check: (config1, config2, name) => !_.has(config1, name) && _.has(config2, name),
    action: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
];

const getCompareMethod = (config1, config2, name) =>
  _.find(compareActionMap, ({ check }) => check(config1, config2, name));

export const compare = (parsedData1, parsedData2) => {
  const allKeys = _.union(_.keys(parsedData1), _.keys(parsedData2));
  const reduced = allKeys.reduce((acc, el) => {
    const { type, action } = getCompareMethod(parsedData1, parsedData2, el);
    return [...acc,
      { name: el, ...action(parsedData1[el], parsedData2[el], compare), type }];
  }, []);
  return reduced;
};

export default (filePath1, filePath2, format = 'pretty') => {
  const file1 = fs.readFileSync(filePath1, 'utf8');
  const file2 = fs.readFileSync(filePath2, 'utf8');
  const parsedData1 = parse(file1, path.extname(filePath1));
  const parsedData2 = parse(file2, path.extname(filePath2));
  const compared = compare(parsedData1, parsedData2);
  return render(compared, format);
};
