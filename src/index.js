import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import render from './renderers/';


const parseMethods = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parseData = (file, extension) => {
  const parse = parseMethods[extension];
  return parse(file);
};

export const compare = (parsedData1, parsedData2) => {
  const allKeys = _.union(_.keys(parsedData1), _.keys(parsedData2));
  const compared = allKeys.reduce((acc, el) => {
    if (_.isObject(parsedData1[el]) && _.isObject(parsedData2[el])) {
      return [...acc, { name: el, children: compare(parsedData1[el], parsedData2[el]), type: 'nested' }];
    }
    if (parsedData1[el] === parsedData2[el]) {
      return [...acc, { name: el, value: parsedData2[el], type: 'unchanged' }];
    }
    if (!parsedData2[el]) {
      return [...acc, { name: el, value: parsedData1[el], type: 'removed' }];
    }
    if (!parsedData1[el]) {
      return [...acc, { name: el, value: parsedData2[el], type: 'added' }];
    }
    return [...acc, {
      name: el, oldValue: parsedData1[el], newValue: parsedData2[el], type: 'changed',
    }];
  }, []);
  return compared;
};

export default (filePath1, filePath2, format = 'string') => {
  const file1 = fs.readFileSync(filePath1, 'utf8');
  const file2 = fs.readFileSync(filePath2, 'utf8');
  const parsedData1 = parseData(file1, path.extname(filePath1));
  const parsedData2 = parseData(file2, path.extname(filePath2));
  const compared = compare(parsedData1, parsedData2);
  return render(compared, format);
};
