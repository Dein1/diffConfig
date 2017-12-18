import _ from 'lodash';
import fs from 'fs';

export default (file1, file2) => {
  const parsedFile1 = JSON.parse(fs.readFileSync(file1));
  const parsedFile2 = JSON.parse(fs.readFileSync(file2));
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
