import _ from 'lodash';

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

const renderToPretty = (ast, level = 0) => {
  const nodeToString = (prefix, name, value) => {
    const renderedValue = _.isObject(value) ? objectToString(value, level + 1) : value;
    return `${addPadding(level)}${prefix}${name}: ${renderedValue}\n`;
  };

  const nodeActionMap = {
    nested: node => nodeToString('    ', node.name, renderToPretty(node.children, level + 1)),
    changed: node => `${nodeToString('  + ', node.name, node.newValue)}${nodeToString('  - ', node.name, node.oldValue)}`,
    unchanged: node => nodeToString('    ', node.name, node.oldValue),
    added: node => nodeToString('  + ', node.name, node.newValue),
    removed: node => nodeToString('  - ', node.name, node.oldValue),
  };

  const reduced = ast.reduce((acc, el) => `${acc}${nodeActionMap[el.type](el)}`, '{\n');
  return `${reduced}${addPadding(level)}}`;
};

export default renderToPretty;
