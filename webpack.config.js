const path = require('path');

const isProduction = process.env.NODE_ENV === 'production'

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