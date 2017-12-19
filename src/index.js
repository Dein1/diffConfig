import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parseMethods = [
  {
    format: '.json',
    parse: config => JSON.parse(fs.readFileSync(config, 'utf8')),
  },
  {
    format: '.yml',
    parse: config => yaml.safeLoad(fs.readFileSync(config, 'utf8')),
  },
  {
    format: '.ini',
    parse: config => ini.parse(fs.readFileSync(config, 'utf8')),
  },
];

const getParseMethod = (filepath) => {
  const extension = path.extname(filepath);
  const method = _.find(parseMethods, ['format', extension]);
  return method.parse(filepath);
};

export default (file1, file2) => {
  const parsedFile1 = getParseMethod(file1);
  const parsedFile2 = getParseMethod(file2);
  const uniq = _.union(_.keys(parsedFile1), _.keys(parsedFile2));
  const reduced = uniq.reduce((acc, el) => {
    if (parsedFile1[el] === parsedFile2[el]) {
      return `${acc}    ${el}: ${parsedFile1[el]}\n`;
    }
    if (parsedFile1[el] !== parsedFile2[el] && parsedFile2[el] === undefined) {
      return `${acc}  - ${el}: ${parsedFile1[el]}\n`;
    }
    if (parsedFile1[el] === undefined) {
      return `${acc}  + ${el}: ${parsedFile2[el]}\n`;
    }
    return `${acc}  + ${el}: ${parsedFile2[el]}\n  - ${el}: ${parsedFile1[el]}\n`;
  }, '{\n');
  return `${reduced}}`;
};
