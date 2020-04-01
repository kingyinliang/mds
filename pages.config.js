const cdn = {
    js: [
        '//unpkg.com/vue@2.6.10/dist/vue.min.js', // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
        '//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js',
        '//unpkg.com/vuex@3.1.1/dist/vuex.min.js',
        '//unpkg.com/axios@0.19.0/dist/axios.min.js'
    ]
}
module.exports = {
    index: {
        entry: 'src/project/LOGIN/main.ts',
        template: 'public/index.html',
        filename: 'index.html'
    },
    MDS: {
        entry: 'src/project/MDS/main.ts',
        template: 'public/MDS.html',
        filename: 'MDS.html'
    },
    DFMDS: {
        entry: 'src/project/DFMDS/main.ts',
        template: 'public/DFMDS.html',
        filename: 'DFMDS.html'
    },
}
