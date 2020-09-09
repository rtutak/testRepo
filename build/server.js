const browserSync = require('browser-sync').create()
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware');

const rimraf = require('rimraf')
const config = require('./../config.js')
const webpackConfig = require('./webpack.dev.conf')
const bundler = webpack(webpackConfig)
//const panini = require('./panini')

if(config.cleanPublicPathOnStart){
    rimraf.sync(config.publicPath)
}
//panini.compileFiles()
//panini.initWatcher()

browserSync.init({
    watch: true,
    // port: config.port,
    // server: {
    //     baseDir: config.publicPath,
    //     directory: true,
    // },
    logFileChanges: false,
    middleware: [
        webpackDevMiddleware(bundler, {
            publicPath: webpackConfig.output.publicPath,
            quiet: true,
            logger: false,
            logLevel: 'silent',
            writeToDisk: true,
        })
    ],
    files: [
        "assets/css/*.css",
    ]
});
