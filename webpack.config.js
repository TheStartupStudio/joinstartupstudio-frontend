const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const DotenvWebpackPlugin = require('dotenv-webpack') // Replace dotenv with dotenv-webpack

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  mode: 'production',
  devServer: {
    static: './dist',
    open: true,
    hot: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true
            }
          }
        ]
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[contenthash].[ext]',
      //         outputPath: 'assets/images',
      //         publicPath: '/assets/images'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|ttf|eot|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(mp4|webm|mov)$/i,
        type: 'asset/resource'
      },
      // {
      //   test: /\.csv$/,
      //   use: 'csv-loader'
      // }
      {
        test: /\.csv$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/files/[name][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      path: require.resolve('path-browserify'), // Provide fallback for path
      fs: false, // Mock fs module to avoid errors
      module: false // Optional: mock other modules if needed
    },
    alias: {
      'react-dom/server': 'react-dom/server.browser.js'
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.png',
      minify: false
      // minify: {
      //   collapseWhitespace: true,
      //   removeComments: true,
      //   removeRedundantAttributes: true
      // }
    }),
    new DotenvWebpackPlugin() // Load environment variables via dotenv-webpack
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single'
  }
}
