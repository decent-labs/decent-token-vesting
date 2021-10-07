const path = require("path");
const enableImportsFromExternalPaths = require("./src/helpers/craco/enableImportsFromExternalPaths");

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          enableImportsFromExternalPaths(webpackConfig, [
            path.resolve(__dirname, "./contracts/typechain"),
          ]);
          return webpackConfig;
        },
      },
    },
  ],
}