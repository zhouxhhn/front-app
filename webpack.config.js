const path = require('path');
const sfe = require('@sipin/sfe');
const HandleCSSLoader = require('@sipin/sfe-preset-standard/handle-css-loader');
const srcPath = path.join(__dirname, './src');
const isDev = process.env.NODE_ENV !== 'production';
// 环境变量
const envConfig = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  API_HOST: JSON.stringify(process.env.API_HOST || ''),
  CDN_URL: JSON.stringify('/static'),
};

const webpackConfig = sfe(() => ({
  entry: './index.web.js',
  template: {
    'index.html': {
      filename: 'index.html',
      template: './index.ejs',
      favicon: './favicon.ico',
    },
  },
  chunk: true,
  extractCSS: true,
  devServer: {
    port: 3102,
    proxy: {
      '/api': {
        target: 'http://10.0.30.118:8005/',
        secure: false,
      },
    },
  },
  presets: [
    require('@sipin/sfe-preset-standard')({
      include: [
        '@sipin/sipin-sales-cloud-components',
        'react-native-vector-icons',
      ],
    }),
    require('@sipin/sfe-preset-react')(),
    require('@sipin/sfe-preset-typescript')(),
    require('@sipin/sfe-preset-eslint')(),
  ],
  env: {
    'process.env': envConfig,
  },
  alias: {
    'react-native$': 'react-native-web',
  },
  static: [
    // {
    //   from: path.join(
    //     __dirname,
    //     './src/configs/config.' + (isDev ? 'dev' : 'prod') + '.js'
    //   ),
    //   to: path.join(__dirname, './dist/static/config.js'),
    // },
    {
      from: path.join(__dirname, './src/static'),
      to: path.join(__dirname, './dist/static'),
    },
  ],

  webpack(sfe) {
    sfe.add('resolve.extensions', [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ]);

    // const handleLoader = new HandleCSSLoader({
    //   extract: true
    // });
    // const options = {
    //   // theme vars, also can use theme.js instead of this.
    //   modifyVars: require('./src/styles/theme.json')
    // };
    // const rule = handleLoader['less'](undefined, options);
    // sfe.add(`rule.less`, {
    //   test: rule.test,
    //   include: filepath => {
    //     // Not ends with `.module.xxx`
    //     return !/\.module\.[a-z]+$/.test(filepath);
    //   },
    //   use: rule.use.map(use => ({
    //     loader: use.loader,
    //     options: use.options
    //   }))
    // });
  },
}));

module.exports = webpackConfig;
