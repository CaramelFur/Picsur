import webpack from 'webpack';

export default {
  plugins: [new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)],
};
