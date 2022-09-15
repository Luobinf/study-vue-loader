const { stringifyRequest } = require("./utils/index")

const pitcher = () => {

}


pitcher.pitch = function() {
    //  [pitcher, vue-loader] 过滤掉 pitcher 自身
    const loaders = this.loaders.filter(isNotPitcher)
    // query=vue&type=script
    const query = new URLSearchParams(this.resourceQuery.slice(1))
    return 90
}


// loader.request 是 loader 文件的绝对路径

// 在前面加上关键字，需要忽略配置文件中的 loader。
module.exports = pitcher

export { default } from './';
