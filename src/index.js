import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parseMethods = [
  {
    format: '.json',
    parse: config => JSON.parse(config),
  },
  {
    format: '.yml',
    parse: config => yaml.safeLoad(config),
  },
  {
    format: '.ini',
    parse: config => ini.parse(config),
  },
];

const parse = (file, extension) => {
  const method = _.find(parseMethods, ['format', extension]);
  return method.parse(file);
};

const render = (parsedData1, parsedData2) => {
  const allKeys = _.union(_.keys(parsedData1), _.keys(parsedData2));
  const rendered = allKeys.reduce((acc, el) => {
    if (parsedData1[el] === parsedData2[el]) {
      return `${acc}    ${el}: ${parsedData2[el]}\n`;
    }
    if (parsedData1[el] && parsedData2[el] === undefined) {
      return `${acc}  - ${el}: ${parsedData1[el]}\n`;
    }
    if (parsedData1[el] === undefined) {
      return `${acc}  + ${el}: ${parsedData2[el]}\n`;
    }
    return `${acc}  + ${el}: ${parsedData2[el]}\n  - ${el}: ${parsedData1[el]}\n`;
  }, '{\n');
  return `${rendered}}`;
};

export default (filePath1, filePath2) => {
  const file1 = fs.readFileSync(filePath1, 'utf8');
  const file2 = fs.readFileSync(filePath2, 'utf8');
  const parsedData1 = parse(file1, path.extname(filePath1));
  const parsedData2 = parse(file2, path.extname(filePath2));
  return render(parsedData1, parsedData2);
};
