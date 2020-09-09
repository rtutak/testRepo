const chokidar = require('chokidar')
const vfs = require('vinyl-fs')
const panini = require('panini')
const config = require('./../config.js')


function runPanini() {

    panini.refresh()

    vfs.src(config.panini.pages)
        .pipe(
            panini({
                root: config.panini.root,
                layouts: config.panini.layouts,
                partials: config.panini.partials,
                helpers: config.panini.helpers,
                data: config.panini.data
            })
        )
        .on('error', function (err) {
            this.emit('end');
        })

        .pipe(
            vfs.dest(config.publicPath)
        )
}

function initWatcher(){

    const watcher = chokidar.watch(['src/**/**/*.html', 'src/**/*.json'], {
        ignored: /(^|[\/\\])\../,
        persistent: true
    })

    watcher
    .on('change', function(path) {
        console.log('File', path, 'has been changed');
        runPanini();
    })

}

module.exports = {
    initWatcher(){
        initWatcher();
    },
    compileFiles(){
        //runPanini();
    }
}
