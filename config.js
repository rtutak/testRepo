const path = require('path')

module.exports = {
    port: 3000,
    publicPath: 'assets', 
    cleanPublicPathOnStart: false,
    assetsCatalog:'',
    entry: {
        // scss
        'css/style': './assets/scss/style.scss',
    },
    modules:[
        "node_modules"
    ],
    copyFiles:[],
    providePlugin:{
    }
    //,
    // vendor:{
    //     name: 'addons/RSThemes/assets/js/vendor',
    //     chunks: (chunk)=>{
    //         return true
    //     },
    //     test: (module)=>{
    //         if(module.context.match(/node_modules/)){
    //             return true
    //         }
    //     },
    // }
}