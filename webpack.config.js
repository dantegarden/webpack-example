/**
 * 自定义的打包规则，基于CommonJS规范来写
 * 所有规则都写在module.exports = {}里
 * **/
let path = require('path')
module.exports = {
    // => 配置环境 默认production会压缩代码 development不会
    mode: 'production',
    // => 入口，从谁开始打包
    entry: './src/my.js',
    // => 出口
    output: {
        // => 输出文件名
        filename: 'bundle.min.js',
        // => 指定输出目录，必须用绝对路径
        // 通过path.resolve可以生成绝对路径， 例如：__dirname（表示当前目录）下的build目录
        path: path.resolve(__dirname, 'build')
    }
};