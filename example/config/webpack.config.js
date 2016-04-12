var path = require('path');
var loader = path.join(__dirname, '../../index.js');
var __DEV__ = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: __DEV__ ? '/public/' : 'https://cdn.example.com/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.(gif|jpeg|jpg|png|svg)$/,
        loader: loader,
        query: {
          attrs: 'width|height|bytes|src|type', // default 'width|height'
          radio: 2, // retina example: width:100,height:100,radio:2 => width:50,height:50
          write: true  // will emits image to the output directory
        }
      }
    ]
  }
};
