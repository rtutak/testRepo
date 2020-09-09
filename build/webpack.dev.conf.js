const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.conf')


const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: "inline-source-map",
    plugins:[]
})
module.exports = webpackConfig
