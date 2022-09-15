class VueLoaderPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        const rules = compiler.options.module.rules
        const pitcher = {
            loader: require.resolve('./pitcher'),
            resourceQuery: (query) => {
                // `?vue&type=script`
                // console.log('命中了吗🎯', ' ##' + query + '##')
                if(!query) return false
                let parsed = new URLSearchParams(query.slice(1))
                return parsed.get('vue') !== null
            }
        }
        console.log(`被截断了`)
        compiler.options.module.rules = [pitcher, ...rules]
    }

}

module.exports = {
    VueLoaderPlugin
}