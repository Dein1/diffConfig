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

const addPadding = level => ' '.repeat(level * 4);

const objectToString = (object, level) => {
  const allKeys = Object.keys(object);
  const reduced = allKeys.reduce((acc, el) => {
    if (_.isObject(object[el])) {
      return `${acc}${addPadding(level + 1)}${el}: ${objectToString(object[el], level + 1)}\n`;
    }
    return `${acc}${addPadding(level + 1)}${el}: ${object[el]}\n`;
  }, '{\n');
  return `${reduced}${addPadding(level)}}`;
};

const renderToString = (ast, level = 0) => {
  const nodeToString = (prefix, name, value) => {
    const renderedValue = _.isObject(value) ? objectToString(value, level + 1) : value;
    return `${addPadding(level)}${prefix}${name}: ${renderedValue}\n`;
  };

  const nodeActionMap = {
    nested: node => nodeToString('    ', node.name, renderToString(node.children, level + 1)),
    changed: node => `${nodeToString('  + ', node.name, node.newValue)}${nodeToString('  - ', node.name, node.oldValue)}`,
    unchanged: node => nodeToString('    ', node.name, node.value),
    added: node => nodeToString('  + ', node.name, node.value),
    removed: node => nodeToString('  - ', node.name, node.value),
  };

  const reduced = ast.reduce((acc, el) => `${acc}${nodeActionMap[el.type](el)}`, '{\n');
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
