const path = require('path');

module.exports = {

  entry: [
    './back/src/index.js'
  ],

  output: {
    filename: 'background.js',
    path: path.join(__dirname, '../', 'build.safariextension')
  },

  resolve: {
    extensions: ['.js', '.json'],
    modules: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.(js)?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        include: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
