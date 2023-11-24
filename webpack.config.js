const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'development'
const config = {
  entry : path.resolve(__dirname, 'src','index.js'),
  output : {
    path: path.resolve(__dirname, 'dist')
  },
  mode : isProduction ? 'production' : 'development',
  module : {
    rules : [
      {
        test :  /\.(tsx?|js)$/,
        exclude : /node_modules/,
        use : ["babel-loader"],
      }
    ]
  },
  plugins:[
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer :['buffer','Buffer'],
    }),
  ],
  resolve : {
    extensions : ['.js'],
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "buffer": require.resolve("buffer/"),
      "url": require.resolve("url/")
    }
  },
}

module.exports = config;