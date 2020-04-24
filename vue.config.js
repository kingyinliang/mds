const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const IS_PROD = ['production', 'uat', 'development'].includes(process.env.NODE_ENV)
console.log(IS_PROD);
const pagesInfo = require('./pages.config')

const resolve = (dir) => {
    return path.join(__dirname, './', dir)
}

module.exports = {
    productionSourceMap: !IS_PROD, // 生产环境的 source map
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
        config.optimization.splitChunks({
            chunks: 'all',// async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
            cacheGroups: {
                vendors: {
                    test: /[\/]node_modules[\/]/,// 指定是node_modules下的第三方包
                    name: 'chunk-vendors',
                    chunks: 'all',
                    priority: -10   // 抽取优先级
                },
                // 抽离自定义工具库
                utilCommon: {
                    name: 'chunk-common',
                    minSize: 1024, // 将引用模块分离成新代码文件的最小体积
                    minChunks: 2, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
                    priority: -20
                }
            }
        });
        if (IS_PROD) {
            // 压缩代码
            config.optimization.minimize(true);
            // 图片大的打包成base64
            config.module
                .rule('images')
                .use('url-loader')
                .loader('url-loader')
                .tap(options => Object.assign(options, { limit: 1024 }))
            // 压缩图片
            // config.module
            //     .rule('images')
            //     .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            //     .use('image-webpack-loader')
            //     .loader('image-webpack-loader')
            //     .options({
            //         mozjpeg: {
            //             progressive: true,
            //             quality: 65
            //         },
            //         optipng: { enabled: false },
            //         pngquant: {
            //             quality: [0.65, 0.90],
            //             speed: 4
            //         },
            //         gifsicle: { interlaced: false }
            //     })
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
        // hash解决缓存
        config.output.filename('[name].[hash].js').end();
    }
}

