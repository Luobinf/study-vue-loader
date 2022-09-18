const compiler = require("vue/compiler-sfc");

function selectBlock(descriptor, scopeId, loaderContext, query) {

  // script
  if (query.get("type") === `script`) {
    const script = compiler.compileScript(descriptor, { id: scopeId })
    loaderContext.callback(null, script.content, script.map);
    return;
  }

  // template
  if (query.get("type") === `template`) {
    const { template } = descriptor;
    loaderContext.callback(null, template.content, template.map);
    return;
  }

  // style
  if (query.get("type") === `style` && query.get("index") != null) {
    const style = descriptor.styles[Number(query.get("index"))];
    loaderContext.callback(null, style.content, style.map);
    return;
  }

}

module.exports = selectBlock;
