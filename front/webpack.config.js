const path = require('path');

module.exports = {

  entry: [
    './front/src/scripts/injectableCode.js'
  ],

  output: {
    filename: 'contentScript.js',
    path: path.join(__dirname, '../', 'build.safariextension'),
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json'],
    modules: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
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
