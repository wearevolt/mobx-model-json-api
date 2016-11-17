
module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!qs)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },

  output: {
    libraryTarget: 'umd',
    library: 'mobx-model-json-api',
    filename: 'lib/index.js'
  }

};