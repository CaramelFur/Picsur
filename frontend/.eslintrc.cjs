module.exports = {
  parserOptions: {
    project: './tsconfig.base.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['src/environments', 'custom-webpack.config.js'],
  root: false,
};
