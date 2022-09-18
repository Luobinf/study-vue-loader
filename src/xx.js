// // code returned from the main loader for 'source.vue'

// // import the <template> block
// import render from 'source.vue?vue&type=template'
// // import the <script> block
// import script from 'source.vue?vue&type=script'
// export * from 'source.vue?vue&type=script'
// // import <style> blocks
// import 'source.vue?vue&type=style&index=1'

// script.render = render
// export default script

// const compiler = require("vue/compiler-sfc");

// const xx = compiler.compileTemplate({
//     source: `<template>
//     <div>{{title}}</div>
// </template>`
// })

// console.log(xx)


console.log( require.resolve('./index.js') )

export { default }


