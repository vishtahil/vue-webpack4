'use strict'
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const devMode = argv.mode === "development";

  let plugins = [
    new CleanWebpackPlugin('wwwroot/*', {}),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'style.csss' : '[style].[chunkhash].css'
    })
  ];

  let output= {
    path: path.resolve(__dirname, 'wwwroot'),
    filename: (devMode) ? 'app.js' : '[app].[chunkhash].js'
  };

  if (devMode) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
   output.publicPath='/';
  }

  return {
    entry: [
      './app/main.js'
    ],
    output: output,
    performance:{
      hints: false
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: {
              inline: false
            }
          }
        })
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            enforce: true,
            chunks: 'all'
          }
        }
      }
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            "common": path.resolve(__dirname, "./app/Common"),
            "components": path.resolve(__dirname, "./app/Components"),
            "pages": path.resolve(__dirname, "./app/Pages"),
            "helpers": path.resolve(__dirname, "./app/Helpers"),
            "store": path.resolve(__dirname, "./app/Store"),
            "directives": path.resolve(__dirname, "./app/Directives"),
            "localization": path.resolve(__dirname, "./app/Localization"),
            "repo": path.resolve(__dirname, "./app/Repo")
        }
    },
    devServer: {
      hot: (devMode) ? true : false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.(png|jpg|gif|ico)$/,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]?[hash]'
          }
        },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url-loader?limit=10000&mimetype=image/svg+xml"
        },
        { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
        {
          test: /\.css$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        }
      ]
    },
    plugins: plugins
  }
};