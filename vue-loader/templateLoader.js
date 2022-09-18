const compiler = require("vue/compiler-sfc");

function templateLoader(source) {

    const loaderContext = this
    const query = new URLSearchParams(loaderContext.resourceQuery.slice(1))
    const id = query.get('id');
    const { code ,map} = compiler.compileTemplate({
        source,
        id
    })
    console.log(`templateLoader`)
    console.log( code )
    console.log(`templateLoader`)

    loaderContext.callback(null, code, map)
}

module.exports = templateLoader;
