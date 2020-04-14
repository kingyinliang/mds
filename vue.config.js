const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const IS_PROD = ['production', 'test', 'development'].includes(process.env.NODE_ENV)

const pagesInfo = require('./pages.config')

const resolve = (dir) => {
    return path.join(__dirname, './', dir)
}

module.exports = {
    productionSourceMap: !IS_PROD,
    lintOnSave: 'warning',
    pages: pagesInfo,
    // css: {
    //     extract: true,
    //     sourceMap: false,
    //     loaderOptions: {}
    // },
    configureWebpack: {
        resolve: {
            extensions: ['js', 'vue', '.json', 'ts', 'tsx'],
            modules: ['src', 'node_modules'],
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                'project': resolve('src/project'),
                '@': resolve('src/project/MDS'),
                'src': resolve('src'),
                'utils': resolve('src/utils'),
                'common': resolve('src/common'),
                'MDS': resolve('src/project/MDS'),
                'DFMDS': resolve('src/project/DFMDS'),
            },
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, './static'),
                    to: 'static',
                    ignore: ['.*'],
                },
            ]),
            new StyleLintPlugin({
                files: ['src/**/*.{vue,html,css,scss,sass,less}'],
                failOnError: false,
                cache: true,
                fix: true,
            })
        ]
    },
    chainWebpack: config => {
        // // 3s白屏
        // config.plugins.delete('prefetch');
        // 修复HMR
        config.resolve.symlinks(true)
        // Chunks
        // config.optimization.splitChunks({
        //     cacheGroups: {
        //         common: {
        //             name: "chunk-common",
        //             chunks: "initial",
        //             minChunks: 2,
        //             maxInitialRequests: 5,
        //             minSize: 0,
        //             priority: 1,
        //             reuseExistingChunk: true,
        //             enforce: true
        //         },
        //         vendors: {
        //             name: "chunk-vendors",
        //             test: /[\\/]node_modules[\\/]/,
        //             chunks: "initial",
        //             priority: 2,
        //             reuseExistingChunk: true,
        //             enforce: true
        //         },
        //         elementUI: {
        //             name: "chunk-elementui",
        //             test: /[\\/]node_modules[\\/]element-ui[\\/]/,
        //             chunks: "all",
        //             priority: 3,
        //             reuseExistingChunk: true,
        //             enforce: true
        //         },
        //         echarts: {
        //             name: "chunk-echarts",
        //             test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
        //             chunks: "all",
        //             priority: 4,
        //             reuseExistingChunk: true,
        //             enforce: true
        //         }
        //     }
        // });
        // 压缩图片
        if (IS_PROD) {
            // 压缩图片
            config.module
                .rule('images')
                .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
                .use('image-webpack-loader')
                .loader('image-webpack-loader')
                .options({
                    mozjpeg: {
                        progressive: true,
                        quality: 65
                    },
                    optipng: { enabled: false },
                    pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                    },
                    gifsicle: { interlaced: false }
                })
        }
        // 添加打包分析
        if (process.env.npm_config_report) {
            config.plugin('webpack-report').use(BundleAnalyzerPlugin, [{
                analyzerHost: '127.0.0.1',
                analyzerPort: 8888,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true
            }])
        }
    }
}

