import renderToJson from './json';
import renderToPlain from './plain';
import renderToPretty from './pretty';

export default (ast, format) => {
  const renderMethods = {
    pretty: renderToPretty,
    plain: renderToPlain,
    json: renderToJson,
  };
  const render = renderMethods[format];
  return render(ast);
};
