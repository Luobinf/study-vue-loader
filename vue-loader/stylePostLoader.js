const compiler = require("vue/compiler-sfc");
// This is a post loader that handles scoped CSS transforms.
// Injected right before css-loader by the global pitcher (../pitch.js)
// for any <style scoped> selection requests initiated from within vue files.
function stylePostLoader(source, needMap) {
  const query = new URLSearchParams(this.resourceQuery.slice(1));
//   console.log("stylePostLoader", this.resourcePath, query);
  const { code, map, errors } = compiler.compileStyle({
    source,
    filename: this.resourcePath,
    id: `data-v-${query.get('id')}`,
    scoped: query.get("scoped"),
    trim: true,
    map: needMap,
    isProd: this.mode === "production" || process.env.NODE_ENV === "production",
  });

  if (errors.length) {
    this.callback(errors[0]);
  } else {
    this.callback(null, code, map);
  }
}

module.exports = stylePostLoader;
