const scopedcss = require('craco-plugin-scoped-css');
const path = require('path');

module.exports = {
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
