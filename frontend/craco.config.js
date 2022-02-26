const scopedcss = require('craco-plugin-scoped-css');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.IgnorePlugin({resourceRegExp: /react-native-sqlite-storage/}),
      ]
    }
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },

    port: 3300,
    liveReload: true,
    hot: true,
    open: false,
  },
  plugins: [
    {
      plugin: scopedcss,
    },
  ],
};
