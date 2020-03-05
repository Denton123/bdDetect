const path = require("path");

const config = {} // 原来的 webpack.base.js 配置

const vuxLoader = require('vux-loader')

module.exports = {
    pages: {
        lab: {
            entry: './src/entry/lab.js',
            filename: 'lab.html',
            chunks: ['chunk-vendors', 'chunk-common', 'lab']
        },
        sales: {
            entry: './src/entry/sales.js',
            filename: 'sales.html',
            chunks: ['chunk-vendors', 'chunk-common', 'sales']
        },
        credit: {
            entry: './src/entry/credit.js',
            filename: 'credit.html',
            chunks: ['chunk-vendors', 'chunk-common', 'credit']
        },
        sampler: {
            entry: './src/entry/sampler.js',
            filename: 'sampler.html',
            chunks: ['chunk-vendors', 'chunk-common', 'sampler']
        },
        finance: {
            entry: './src/entry/finance.js',
            filename: 'finance.html',
            chunks: ['chunk-vendors', 'chunk-common', 'finance']
        }
    },
    assetsDir: "./reception/static/",
    configureWebpack: config => {
        vuxLoader.merge(config, {
            plugins: [{
                    name: 'vux-ui'
                },
                {
                    name: 'less-theme',
                    path: 'src/style/theme.less'
                },
                {
                    name: 'i18n',
                    vuxStaticReplace: false,
                    staticReplace: false,
                    extractToFiles: 'src/locales/components.yml',
                    localeList: ['en', 'zh-CN']
                }
            ]
        })
    },
    devServer: {
        disableHostCheck: true,
    },
}