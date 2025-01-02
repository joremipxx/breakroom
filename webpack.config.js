const path = require('path');
const fs = require('fs');
const { override } = require('customize-cra');
const webpack = require('webpack');

module.exports = override((config) => {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      "stream": require.resolve("stream-browserify"),
      "readable-stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("util/")
    }
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
      Stream: ['stream-browserify']
    })
  ];

  return config;
});

devServer: {
  https: {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'localhost.pem')),
  },
  port: 3001,
  host: 'localhost'
}
}; 