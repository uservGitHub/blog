/**
 * Created by Zhengfeng.Yao on 2017/12/26.
 */
const path = require('path');
const webpack = require('webpack');
const Config = require('tdtool').Config;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const isDebug = process.env.NODE_ENV !== 'production';
const root = path.resolve(process.cwd(), 'dist');

const AssetsPlugin = require('assets-webpack-plugin');

const siteConfig = new Config({
  entry: {
    home: './src/site/home.tsx',
  },
  dist: './dist/website',
  filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
  minimize: !isDebug,
  extends: [['less', {
    extractCss: {
      filename: '[name].css?[hash]'
    }
  }]]
});

siteConfig.add('rule.ts', {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      babelrc: false,
      presets: [
        'es2015-ie',
        'react',
        'stage-2',
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-runtime'
      ]
    }
  }, {
    loader: 'ts-loader'
  }]
});

siteConfig.add(
  'plugin.AssetsPlugin',
  new AssetsPlugin({
    path: './dist/website',
    filename: 'assets.json',
    prettyPrint: true,
  })
);

/* 服务端配置 */
const serverConfig = new Config({
  entry: './src/server/index.ts',
  dist: './dist/server',
  target: 'node',
  filename: 'main.js',
  devServer: isDebug,
  sourceMap: true,
  externals: [/^\.\.\/website\/assets\.json$/, require('webpack-node-externals')()],
  extends: [['less', {
    target: 'node'
  }]]
});

serverConfig.add('rule.ts', {
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /node_modules/
});

function loadCommon(config, key) {
  config.add('resolve.extensions', [".tsx", ".ts", ".js"]);
  config.add(
    'plugin.CleanWebpackPlugin',
    new CleanWebpackPlugin(
      [key],
      {
        root,                                  //根目录
        verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
        dry:      false        　　　　　　　　　　//启用删除文件
      }
    )
  );
  config.add('rule.articles', {
    test: /\.DOCS$/,
    loader: 'articles-loader',
    query: {
      root: path.join(__dirname, 'articles')
    }
  });
}

loadCommon(siteConfig, 'website');
loadCommon(serverConfig, 'server');

module.exports = [siteConfig.resolve(), serverConfig.resolve()];
