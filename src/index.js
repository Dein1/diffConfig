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

const parse = (file, extension) => {
  const method = parseMethods[extension];
  return method(file);
};

export const compare = (parsedData1, parsedData2) => {
  const allKeys = _.union(_.keys(parsedData1), _.keys(parsedData2));
  const compared = allKeys.reduce((acc, el) => {
    if (parsedData1[el] === parsedData2[el]) {
      return acc.concat({ name: el, value: parsedData2[el], action: 'unchanged' });
    }
    if (parsedData1[el] && parsedData2[el] === undefined) {
      return acc.concat({ name: el, value: parsedData1[el], action: 'removed' });
    }
    if (parsedData1[el] === undefined) {
      return acc.concat({ name: el, value: parsedData2[el], action: 'added' });
    }
    return acc.concat({ name: el, value: parsedData2[el], action: 'added' }, { name: el, value: parsedData1[el], action: 'removed' });
  }, []);
  return compared;
};

const renderToString = (ast) => {
  const reduced = ast.reduce((acc, el) => {
    if (el.action === 'unchanged') {
      return `${acc}    ${el.name}: ${el.value}\n`;
    }
    if (el.action === 'removed') {
      return `${acc}  - ${el.name}: ${el.value}\n`;
    }
    return `${acc}  + ${el.name}: ${el.value}\n`;
  }, '{\n');
  return `${reduced}}`;
};

export const diff = (filePath1, filePath2) => {
  const file1 = fs.readFileSync(filePath1, 'utf8');
  const file2 = fs.readFileSync(filePath2, 'utf8');
  const parsedData1 = parse(file1, path.extname(filePath1));
  const parsedData2 = parse(file2, path.extname(filePath2));
  const compared = compare(parsedData1, parsedData2);
  return renderToString(compared);
};
