const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default
const analize = process.env.analize && Number(process.env.analize)


const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false, // Must be set to true if using source-maps in production
                terserOptions: {
                }
            }),
            new OptimizeCSSAssetsPlugin(),
            new BundleAnalyzerPlugin()
        ]
    }
})

webpackConfig.plugins.push(new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }))

module.exports = webpackConfig
