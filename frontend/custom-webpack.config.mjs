import webpack from 'webpack';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default {
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    // new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
          },
        },
      },
    ],
  },
};
