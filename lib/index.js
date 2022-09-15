const compiler = require("vue/compiler-sfc");
const hash = require('hash-sum')
const { stringifyRequest } = require("./utils/index")
const { VueLoaderPlugin } = require("./plugin");


function loader(source) {
  console.log(12)
  const { resourceQuery, resourcePath } = this;

  // 第三轮的执行
  const { descriptor } = compiler.parse(source);
  const code = [];
  const { script } = descriptor;
  if (script) {
    const query = `?vue&type=script`
    const request = stringifyRequest(this, resourcePath + query)
    code.push(`import script from ${request}`)
    code.push(`export default script`)
  }
  console.log(code.join('\n'))
  return code.join('\n')
}

loader.VueLoaderPlugin = VueLoaderPlugin

module.exports = loader;


// const source = `<script>
// console.log('App');
// </script>`;

// const { descriptor } = compiler.parse(source);
// console.log(descriptor, "descriptor");
