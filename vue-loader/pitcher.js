const stylePostLoaderPath = require.resolve("./stylePostLoader");

const isCSSLoader = (loader) => /(\/|\\|@)css-loader/.test(loader.path);
const isNotPitcher = (loader) => loader.path !== __filename;

const pitcher = (source) => {
  return source;
};

pitcher.pitch = function () {
  // console.log('pitch999', this.loaders)
  //  [pitcher, vue-loader, ...], 过滤掉 pitcher 自身。
  const loaderContext = this;
  const loaders = this.loaders.filter(isNotPitcher);
  // console.log(loaders[0].request)
  // query=vue&type=script
  const query = new URLSearchParams(this.resourceQuery.slice(1));

  // Inject style-post-loader before css-loader for scoped CSS
  // 在 css-loader 之前注入 style-post-loader，用于作用域CSS
  if (query.get("type") === `style`) {
    const cssLoaderIndex = loaders.findIndex(isCSSLoader);
    if (cssLoaderIndex > -1) {
      const afterLoaders = loaders.slice(0, cssLoaderIndex + 1); // 包含 cssLoader
      const beforeLoaders = loaders.slice(cssLoaderIndex + 1);

      return genProxyModule(
        [...afterLoaders, stylePostLoaderPath, ...beforeLoaders],
        loaderContext,
        !!query.get("module")
      );
    }
  }

  return genProxyModule(
    loaders,
    loaderContext,
    query.get("type") !== "template"
  );
};

function genProxyModule(loaders, context, exportDefault = true) {
  const request = genRequest(loaders, context);
  console.log(`8888888request`);
  console.log(request);
  console.log(`8888888request`);
  // 不同区块返回不同内容。这里需要使用 export 导出内容，不然 import 区块时就没有内容。
  // return a proxy module which simply re-exports everything from the
  // actual request. Note for template blocks the compiled module has no
  // default export.
  return (
    (exportDefault ? `export { default } from ${request};` : ``) +
    `\nexport * from ${request}`
  );
}

function genRequest(loaders, context) {
  const loaderStrings = loaders.map((loader) => loader.request || loader);
  const resource = context.resourcePath + context.resourceQuery;
  console.log(54467575);
  console.log(resource);
  console.log(54467575);
  return JSON.stringify(
    context.utils.contextify(
      context.context,
      "-!" + [...loaderStrings, resource].join("!")
    )
  );
}

// loader.request 是 loader 文件的绝对路径
// 在前面加上关键字，需要忽略配置文件中的 loader。

module.exports = pitcher;
