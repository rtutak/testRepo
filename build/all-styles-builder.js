const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')
const config = require('../config.js')
const rimraf = require('rimraf')
const cloneDeep = require('lodash/cloneDeep');

let newConfg = webpackConfig

// remove js files
for (const entryKey of Object.keys(newConfg.entry)) {
    if (newConfg.entry[entryKey].includes('.js')) {
        delete newConfg.entry[entryKey]
    }
}

// remove unnecessary plugins
newConfg.plugins = newConfg.plugins.filter((plugin)=>{
    if (plugin.constructor.name === 'CopyPlugin' || plugin.constructor.name === 'ImageminPlugin') {
        return false
    }else{
        return true
    }
})
newConfg.optimization.minimizer = newConfg.optimization.minimizer.filter((plugin)=>{
    if (plugin.constructor.name === 'BundleAnalyzerPlugin' || plugin.constructor.name === 'TerserPlugin') {
        return false
    }else{
        return true
    }
})

function injectStyleVariable(config, style) {
    const rules = config.module.rules.map((rule) => {
        if (rule.test.toString() === '/\\.scss$/') {
            const newRule = rule
            newRule.use.map((loader) => {
                if (loader.loader === 'sass-loader') {
                    loader.options.prependData = `$style: '${style}';`
                    return loader
                } else {
                    return loader
                }
            })
            return newRule
        } else {
            return rule
        }
    })
    config.module.rules = rules
    return config
}


function getTransformedEntry(dest, style) {
    const splitedDest = dest.split('/')
    const fileName = splitedDest[splitedDest.length-1]
    let path = config.stylesBuilder.path.replace('{{style}}', style)
    return `${path}/${fileName}`
}


function compileStyles() {
    for (const style of config.stylesBuilder.styles) {
        let styleWebpackConfig = cloneDeep(newConfg)
        let entry = {}

        for (const entryKey of Object.keys(newConfg.entry)) {
            // handle futuristic style exception
            if(style !== 'futuristic' && entryKey.includes('futuristic-custom')){
                delete styleWebpackConfig.entry[entryKey]
                continue
            }

            const newDest = getTransformedEntry(entryKey, style)
            entry[newDest] = newConfg.entry[entryKey]
        }

        styleWebpackConfig.entry = entry
        styleWebpackConfig = injectStyleVariable(styleWebpackConfig, style)
        webpack(styleWebpackConfig, (err,stats) => {
            if (err) throw err
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n')
        })
    }
}

function removeOldCatalog() {
    const splitedPath = config.stylesBuilder.path.split('/')
    rimraf.sync('dist/' + splitedPath[0])
}

function init() {
    if (config.stylesBuilder.removeOldCatalog) {
        removeOldCatalog()
    }
    compileStyles()
}
init()