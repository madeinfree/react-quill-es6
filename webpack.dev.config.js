var path = require('path');

module.exports = {
  entry: {
    app: [ './demo/index.react.js' ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'build'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
  			test: /\.css$/,
  			loader: "style-loader!css-loader"
  		},
    ]
  }
};
