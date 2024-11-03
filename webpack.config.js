const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/editorjs-columns.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'editorjs-columns.bundle.js',
    library: 'editorjsColumns',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'editorjs-columns.css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'svg-inline-loader',
          options: {
            removeSVGTagAttrs: false
          }
        }]
      }
    ],
  },
};