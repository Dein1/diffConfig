import renderToJson from './json';
import renderToPlain from './plain';
import renderToPretty from './pretty';

const renderMethods = {
  pretty: renderToPretty,
  plain: renderToPlain,
  json: renderToJson,
};

export default (ast, format) => {
  const render = renderMethods[format];
  return render(ast);
};
