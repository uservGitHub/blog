/**
 * Created by Zhengfeng.Yao on 2017/12/26.
 */
const path = require('path');
const webpack = require('webpack');
const Config = require('tdtool').Config;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const isDebug = process.env.NODE_ENV !== 'production';
const root = path.resolve(process.cwd(), 'dist');

const clientConfig = new Config({
  entry: {
    client: './src/website/index.js'
  },
  dist: './dist/website',
  filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
  minimize: !isDebug,
  extends: [['react'], ['less', {
    extractCss: {
      filename: isDebug ? '[name].css?[hash]' : '[name].css',
      allChunks: true
    },
    happypack: true
  }]]
});

clientConfig.add(
  'plugin.CleanWebpackPlugin',
  new CleanWebpackPlugin(
    ['website'],
    {
      root,                                  //根目录
      verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
      dry:      false        　　　　　　　　　　//启用删除文件
    }
  )
);

const AssetsPlugin = require('assets-webpack-plugin');
clientConfig.add(
  'plugin.AssetsPlugin',
  new AssetsPlugin({
    path: './dist/website',
    filename: 'assets.json',
    prettyPrint: true,
  })
);

const serverConfig = new Config({
  entry: './src/server/index.ts',
  target: 'node',
  filename: 'server.js',
  devServer: isDebug,
  minimize: !isDebug,
  sourceMap: true,
  externals: [/^\.\/website\/assets\.json$/, require('webpack-node-externals')()]
});

serverConfig.add('resolve.extensions', [".tsx", ".ts", ".js"]);

serverConfig.add('rule.ts', {
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /node_modules/
});

module.exports = [clientConfig.resolve(), serverConfig.resolve()];