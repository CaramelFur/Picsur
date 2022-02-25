const scopedcss = require('craco-plugin-scoped-css');

module.exports = {
  devServer: {
    writeToDisk: true,
    port: 3300,
    liveReload: true,
    open: false,
  },
  plugins: [
    {
      plugin: scopedcss,
    },
  ],
};
