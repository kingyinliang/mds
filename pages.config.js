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
        title: '欣和-制造管理系统',
        entry: 'src/project/LOGIN/main.ts',
        template: 'public/index.html',
        filename: 'index.html',
        chunk: ["chunk-vendors", "chunk-common", 'index']
    },
    MDS: {
        title: '欣和-制造管理系统',
        entry: 'src/project/MDS/main.ts',
        template: 'public/MDS.html',
        filename: 'MDS.html',
        chunk: ["chunk-vendors", "chunk-common", 'MDS']
    },
    DFMDS: {
        title: '欣和-制造管理系统',
        entry: 'src/project/DFMDS/main.ts',
        template: 'public/DFMDS.html',
        filename: 'DFMDS.html',
        chunk: ["chunk-vendors", "chunk-common", 'DFMDS']
    },
    DATABOARD: {
        title: '欣和-制造管理系统',
        entry: 'src/project/DATABOARD/main.ts',
        template: 'public/DATABOARD.html',
        filename: 'DATABOARD.html',
        chunk: ["chunk-vendors", "chunk-common", 'DATABOARD']
    },
    SYSTEM: {
        title: '欣和-制造管理系统',
        entry: 'src/project/SYSTEM/main.ts',
        template: 'public/SYSTEM.html',
        filename: 'SYSTEM.html',
        chunk: ["chunk-vendors", "chunk-common", 'SYSTEM']
    }
}
