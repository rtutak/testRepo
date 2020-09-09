const path = require('path')
const argv = require('yargs').argv
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require('webpack')
const config = require('./../config.js')


function getTransformedEntry(dest, style) {
    const splitedDest = dest.split('/')
    const fileName = splitedDest[splitedDest.length-1]
    let path = config.stylesBuilder.path.replace('{{style}}', style)
    return `${path}/${fileName}`
}

// 
let entry = config.entry
let SASSPrependData = '';
if(argv.style && config.stylesBuilder.styles.includes(argv.style)){
    let transforemdEntry = {}
    for (const entryKey of Object.keys(entry)) {
        if(!entry[entryKey].includes('.js')){
            // handle futuristic style exception
            if(argv.style !== 'futuristic' && entryKey.includes('futuristic-custom')){
                delete entry[entryKey]
                continue
            }
    
            const newDest = getTransformedEntry(entryKey, argv.style)
            transforemdEntry[newDest] = entry[entryKey]
        }else{
            transforemdEntry[entryKey] = entry[entryKey]
        }
    }
    entry = transforemdEntry
    SASSPrependData = `$style: '${argv.style}';`
}
const webpackConfig = {
    entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../' + config.publicPath),
        publicPath: config.publicPath,
    },
    resolve: {
        modules: config.modules
    },
    module: {
        rules: [{
                test: /\.scss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            prependData: SASSPrependData,
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options:{
                        babelrc: true
                    }
                }
            },
            {
                test: /\jquery.js$/,
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ]
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             vendor: {
    //                 chunks: config.vendor.chunks,
    //                 name: config.vendor.name,
    //                 test: config.vendor.test
    //             },
    //         }
    //     }
    // },
    externals: config.externals,
    plugins: [
        new webpack.ProvidePlugin(config.providePlugin),
        new FriendlyErrorsWebpackPlugin(),
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ]
}

if(config.assetsCatalog.length){
    webpackConfig.plugins.push(
        new CopyWebpackPlugin([{
            from: 'static',
            to: '.',
            ignore: ['.*']
        }])
    )
}

for(let catalog of config.copyFiles){
    webpackConfig.plugins.push(
        new CopyWebpackPlugin([{
            from: catalog.from,
            to: catalog.to,
            ignore: ['.*']
        }])
    )
}



module.exports = webpackConfig
