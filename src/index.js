import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

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
      return [...acc, { name: el, value: compare(parsedData1[el], parsedData2[el]), type: 'recursive' }];
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
    return [...acc, { name: el, value: parsedData2[el], type: 'added' }, { name: el, value: parsedData1[el], type: 'removed' }];
  }, []);
  return compared;
};

const addPadding = level => '    '.repeat(level);

const objectToString = (object, level) => {
  const allKeys = Object.keys(object);
  const reduced = allKeys.reduce((acc, el) => {
    if (_.isObject(object[el])) {
      return `${acc}${addPadding(level)}    ${el}: ${objectToString(object[el], level + 1)}\n`;
    }
    return `${acc}${addPadding(level)}    ${el}: ${object[el]}\n`;
  }, '{\n');
  return `${reduced}${addPadding(level)}}`;
};

const renderToString = (ast, level = 0) => {
  const reduced = ast.reduce((acc, el) => {
    if (el.type === 'recursive') {
      return `${acc}${addPadding(level)}    ${el.name}: ${renderToString(el.value, level + 1)}\n`;
    }
    const newValue = _.isObject(el.value) ? objectToString(el.value, level + 1) : el.value;
    if (el.type === 'unchanged') {
      return `${acc}${addPadding(level)}    ${el.name}: ${newValue}\n`;
    }
    if (el.type === 'removed') {
      return `${acc}${addPadding(level)}  - ${el.name}: ${newValue}\n`;
    }
    return `${acc}${addPadding(level)}  + ${el.name}: ${newValue}\n`;
  }, '{\n');
  return `${reduced}${addPadding(level)}}`;
};

export default (filePath1, filePath2) => {
  const file1 = fs.readFileSync(filePath1, 'utf8');
  const file2 = fs.readFileSync(filePath2, 'utf8');
  const parsedData1 = parseData(file1, path.extname(filePath1));
  const parsedData2 = parseData(file2, path.extname(filePath2));
  const compared = compare(parsedData1, parsedData2);
  return renderToString(compared);
};
