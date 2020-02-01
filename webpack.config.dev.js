/**
 * 自定义的打包规则，基于CommonJS规范来写
 * 所有规则都写在module.exports = {}里
 * **/
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin') //每个插件都是个类
let { CleanWebpackPlugin } = require('clean-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
let TerserPlugin = require('terser-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin')
let webpack = require('webpack')

module.exports = {
    // => 配置环境 默认production会压缩代码 development不会
    mode: 'production',
    // => 入口，从谁开始打包
    entry: ['./src/my.js'],
    // => 出口
    output: {
        // => 配置引用前缀（在所有资源引入的地方拼上这个）
        publicPath: "./",
        // => 输出文件名 [hash]让每次生成的文件名都带上hash值
        filename: 'js/bundle.min.[hash].js',
        // => 指定输出目录，必须用绝对路径
        // 通过path.resolve可以生成绝对路径， 例如：__dirname（表示当前目录）下的build目录
        path: path.resolve(__dirname, 'dist')
    },
    // => 关于webpack-dev-server的配置，它会创建一个server，把编译的东西加入到虚拟内存中
    devServer: {
        //=> 指定端口号
        port: 3000,
        // => 打包时显示进度
        progress: true,
        // => 指定当前server处理的资源目录
        contentBase: './dist',
        // => 编译完成自动打开浏览器
        open: true
    },
    // => 使用个插件
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // =>指定要编译的文件 不指定会走它默认模板
            template: './src/index.html',
            // =>编译后的文件名
            filename: 'index.html',
            // =>为避免浏览器缓存，生成随机时间戳传参，每次引入的js路径都不一样
            // hash: true
            // =>压缩规则
            minify: {
                collapseWhitespace: true, //删掉空格
                removeComments: true, //删掉注释
                removeAttributeQuotes: true, //干掉标签上的属性的引号
                removeEmptyAttributes: true //干掉标签上的空属性
            }
        }),
        new MiniCssExtractPlugin({ // => 抽离html里用到的css
            // => 指定输出的文件名
            filename: "css/main.min.[hash].css"
        }),
        //=> 向每个模块中注入全局变量
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ],
    // => 使用加载器loader来处理规则
    module: {
        // => 给模块配置加载规则
        rules: [
            {
                test: /\.(css|less)$/i, // => 基于正则匹配处理那些文件
                // => 使用哪个加载器，从右到左、从下到上执行
                use: [
                    // "style-loader", // => 把编译好的css内嵌到页面<head>的<style>当中
                    MiniCssExtractPlugin.loader, // => 抽离css文件，并让html引入
                    "css-loader", // => 编译css里的@import/url()语法
                    {
                        loader: "postcss-loader", // => 对css3语法设置如-webkit之类的前缀，需要安装autoprefixer并配置postcss.config.js
                        options: {
                            ident: "postcss",
                            plugins: [require("autoprefixer")]
                        }
                    },
                    {
                        loader: "less-loader",// => 把less编译成css
                        options: {}
                    }
                ],
            },
            {
                test: /\.js$/i,
                exclude: /(node_modules)/, // => 指定js编译的目录（忽略那些目录）
                include: path.resolve(__dirname, 'src'), // => 只编译src下的目录
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|webp|bmp)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1 * 1024, // => 只要图片小于200kb，一律转为base64
                            outputPath: 'images' //=> 图片放在images/下
                        }
                    },
                    // 'eslint-loader' //需要先安装eslint eslint-loader
                ]
            },
            {
                //=> 处理html中引入的图片的地址
                test: /\.(html|htm|xml)$/i,
                use: ['html-withimg-loader']
            }
        ]
    },
    // => 配置优化规则
    optimization: {
        // => 压缩优化，一旦指定压缩优化，mode=production的自动压缩和编译就全部失效了
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin(), // => 压缩css
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true
            // })
        ]
    }
};