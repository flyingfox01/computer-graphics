module.exports = async ({ config }) => {
  console.log('config', config);
  config.module.rules.push({
    test: /\.glsl$/,
    loader: 'raw-loader',
  });
  return config;
};
