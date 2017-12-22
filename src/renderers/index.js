import _ from 'lodash';

// to string
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

// to plain text
const renderToPlain = (ast, parents = []) => {
  const reduced = ast.reduce((acc, node) => {
    const newName = [...parents, node.name].join('.');
    const renderedValue = _.isObject(node.value) ? 'complex value' : `value: ${node.value}`;
    const nodeActionMap = {
      nested: () => renderToPlain(node.children, [...parents, node.name]),
      changed: () => `Property '${newName}' was updated. From '${node.oldValue}' to '${node.newValue}'\n`,
      unchanged: () => '',
      added: () => `Property '${newName}' was added with ${renderedValue}\n`,
      removed: () => `Property '${newName}' was removed\n`,
    };
    return `${acc}${nodeActionMap[node.type]()}`;
  }, '');
  return reduced;
};


export default (ast, format) => {
  const renderMethods = {
    string: renderToString,
    plain: renderToPlain,
  };
  const render = renderMethods[format];
  return render(ast);
};
