
const webpack  = require('webpack')
const rimraf = require('rimraf')
const webpackConfig = require('./webpack.prod.conf')
const panini = require('./panini')
const config = require('./../config.js')


if(config.cleanPublicPathOnStart){
    rimraf.sync(config.publicPath)
}
panini.compileFiles()



webpack(webpackConfig, (err,stats) => {

    if (err) throw err

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')
});
