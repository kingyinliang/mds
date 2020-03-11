const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, './', dir)
}

module.exports = {
  pages: {
    index: {
      entry: 'src/common/main.ts',
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
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['js', 'vue', '.json', 'ts', 'tsx'],
      modules: ['src', 'node_modules'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve('src/project/MDS'),
        MDS: resolve('src/project/MDS'),
        DFMDS: resolve('src/project/DFMDS')
      }
    }
  },
  chainWebpack: config => {
  //  chainWebpack
  }
}
