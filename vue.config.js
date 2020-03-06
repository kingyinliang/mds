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
  }
}
