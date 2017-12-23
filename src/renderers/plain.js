import _ from 'lodash';

const renderToPlain = (ast, parents = []) => {
  const reduced = ast.reduce((acc, node) => {
    const newName = [...parents, node.name].join('.');
    const renderedValue = _.isObject(node.newValue) ? 'complex value' : `value: ${node.newValue}`;
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

export default renderToPlain;
