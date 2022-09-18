const compiler = require("vue/compiler-sfc");
const hash = require("hash-sum");
const { stringifyRequest } = require("./utils/index");
const path = require("path");
const { VueLoaderPlugin } = require("./plugin");
const selectBlock = require("./select");

function loader(source) {
  const loaderContext = this;
  const { resourceQuery, resourcePath, rootContext, sourceMap, mode } = loaderContext;

  const isProduction =
    mode === 'production' || process.env.NODE_ENV === 'production'
  const filename = resourcePath.replace(/\?.*$/, "");

  const { descriptor } = compiler.parse(source);
  const { script, scriptSetup } = descriptor;

  // 如果查询字符串中已经带有了 type 字段，表示这是一个经过 pitcher loader 处理过后的 .vue 文件，
  //此时需要通过 selectBlock 去处理不同的资源类型。此时需要直接return
  // e.g foo.vue?type=template&id=xxxxx

  const rawQueryString = resourceQuery.slice(1);
  const incomingQuery = new URLSearchParams(rawQueryString);

  // module id for scoped CSS & hot-reload
  const rawShortFilePath = path
    .relative(rootContext || process.cwd(), filename)
    .replace(/^(\.\.[\/\\])+/, "");
  const shortFilePath = rawShortFilePath.replace(/\\/g, "/");
  const id = hash(
    isProduction
      ? shortFilePath + "\n" + source.replace(/\r\n/g, "\n")
      : shortFilePath
  );

  if (incomingQuery.get('type')) {
		// console.log('incomingQuery', resourcePath + resourceQuery, this.request)
    return selectBlock(descriptor, id, loaderContext, incomingQuery);
  }

  // 用于作用域 CSS 
  const hasScoped = descriptor.styles.some((style) => style.scoped)


  let scriptImport = `const script = {}`;
  if (script || scriptSetup) {
    // const lang = script.lang || scriptSetup.lang
    // eg: /project/foo.vue?vue&type=script'
    const src = (script && !scriptSetup && script.src) || resourcePath;
    const attrsQuery = attrsToQuery((script || scriptSetup).attrs, "js");
    const query = `?vue&type=script${attrsQuery}${resourceQuery}`;
    const scriptRequest = stringifyRequest(this, src + query);
    // console.log(9089, scriptRequest, "##" + resourceQuery + "##");
    scriptImport =
      `import script from ${scriptRequest}\n` +
      // support named exports
      `export * from ${scriptRequest}`;
  }

  // template
  let templateImport = ``
	if(descriptor.template) {
		// console.log('descriptor.template', descriptor.template)
    // eg: /project/foo.vue?vue&type=template&id=xxxxxx
		const idQuery = `&id=${id}`
    const scopedQuery = hasScoped ? `&scoped=true` : ''
    const src = descriptor.template.src || resourcePath;
    const attrsQuery = attrsToQuery(descriptor.template.attrs);
		const query = `?vue&type=template${idQuery}${scopedQuery}${attrsQuery}${resourceQuery}`; 
    const templateRequest = stringifyRequest(this, src + query);
		templateImport = `import { render } from ${templateRequest}\n`
	}

  // styles
  let stylesCode = ``
  if(descriptor.styles.length) {
    // eg: import 'source.vue?vue&type=style&index=1&scoped&id=xxx&lang=scss'
    descriptor.styles.forEach( (style, i) => {
      const idQuery = !style.src || style.scoped ? `&id=${id}` : ``
      const lang = style.lang ? style.lang: 'css'
      const langQuery = `&lang=${lang}`
      const src = style.src || resourcePath;
      const attrsQuery = attrsToQuery(style.attrs);
      let query = `?vue&type=style&index=${i}${idQuery}${attrsQuery}${resourceQuery}`
      // style 属性上没有设置 lang 属性时，默认将 lang 属性设置为 css
      if(attrsQuery.indexOf(`lang`) === -1) {
        query += langQuery
      }
      const styleRequest = stringifyRequest(this, src + query);
      // console.log('styleRequeststyleRequeststyleRequest', styleRequest)
      stylesCode += `\nimport ${styleRequest}`
    })
  }


  let code = [templateImport, scriptImport, stylesCode].join("\n");
  
	if(templateImport) {
		code += `\nscript.render = render`
	}

  if(hasScoped) {
    code += `\nscript.__scopeId = "data-v-${id}"`
  }

  code += `\n\nexport default script`;

	// console.log(88888)
	// console.log( code )
	// console.log(88888)
  return code;
}

loader.VueLoaderPlugin = VueLoaderPlugin;

module.exports = loader;


// these are built-in query parameters so should be ignored
// if the user happen to add them as attrs
const ignoreList = ["id", "index", "src", "type"];

function attrsToQuery(attrs, langFallback) {
  let queryStr = ``;
  for (const name in attrs) {
    const val = attrs[name];
    if (!ignoreList.includes(name)) {
      queryStr += `&${name}=${val ? val : ""}`;
    }
  }
  if (langFallback && !(`lang` in attrs)) {
    queryStr += `&lang=${langFallback}`;
  }
  return queryStr;
}
