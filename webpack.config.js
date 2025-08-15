const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const DotenvWebpackPlugin = require('dotenv-webpack') // Replace dotenv with dotenv-webpack
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  mode: 'production',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public') // <-- This serves public/ at root
    },
    open: true,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: (error) => {
          // Suppress ResizeObserver errors with multiple variations
          const message = error.message || ''
          const stack = error.stack || ''

          if (
            message.includes(
              'ResizeObserver loop completed with undelivered notifications'
            ) ||
            message.includes('ResizeObserver loop limit exceeded') ||
            stack.includes('ResizeObserver') ||
            message.includes('webpack-dev-server/client/overlay.js')
          ) {
            return false
          }
          return true
        },
        warnings: false,
        runtimeErrors: (error) => {
          const message = error.message || ''
          if (
            message.includes(
              'ResizeObserver loop completed with undelivered notifications'
            )
          ) {
            return false
          }
          return true
        }
      }
    }
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
      {
        test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|ttf|eot|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(mp4|webm|mov)$/i,
        type: 'asset/resource'
      },
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
      favicon: './public/favicon.ico',
      minify: false
    }),
    new DotenvWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'public/academy-phone-*.png', to: '[name][ext]' }
      ]
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single'
  }
}
