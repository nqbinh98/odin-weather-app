const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js', 
  output: {
    filename: 'main.js', 
    path: path.resolve(__dirname, 'dist'), 
    publicPath: 'auto',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i, 
        use: ['style-loader', 'css-loader'],
      },
      {
        oneOf: [
          {
            test: /\.svg$/i,
            resourceQuery: /raw/, 
            type: 'asset/source', 
          },
          {

            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource'
          },

        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // File HTML gốc của bạn
    }),
  ],
};