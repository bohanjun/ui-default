/* eslint-disable import/no-extraneous-dependencies */
import { relative, dirname } from 'path';
import webpack from 'webpack';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import ExtractCssPlugin from 'mini-css-extract-plugin';
import mapWebpackUrlPrefix from '../utils/mapWebpackUrlPrefix';
import root from '../utils/root';

const beautifyOutputUrl = mapWebpackUrlPrefix([
  { prefix: 'node_modules/katex/dist/', replace: './katex/' },
  { prefix: 'misc/.iconfont', replace: './ui/iconfont' },
]);

export default function (env = {}) {
  function cssLoader() {
    return {
      loader: 'css-loader',
      options: { importLoaders: 1 },
    };
  }

  function postcssLoader() {
    return {
      loader: 'postcss-loader',
      options: { sourceMap: env.production },
    };
  }

  function fileLoader() {
    return {
      loader: 'file-loader',
      options: { name: '[path][name].[ext]?[sha1:hash:hex:10]' },
    };
  }

  function extractCssLoader() {
    return {
      loader: ExtractCssPlugin.loader,
      // FIXME auto?
      options: {
        publicPath: (resourcePath, context) => `${relative(dirname(resourcePath), context)}/`
        ,
      },
    };
  }

  const config = {
    bail: true,
    mode: env.production ? 'production' : 'development',
    profile: true,
    context: root(),
    entry: {
      'theme.default': './theme/default.js',
    },
    output: {
      path: root('public'),
      publicPath: '/', // overwrite in entry.js
      hashFunction: 'sha1',
      hashDigest: 'hex',
      hashDigestLength: 10,
      filename: '[name].js?[chunkhash]',
      chunkFilename: '[name].style.js?[chunkhash]',
    },
    resolve: {
      modules: [root('node_modules')],
      alias: { vj: root() },
    },
    module: {
      rules: [
        {
          // fonts and images
          test: /\.(svg|ttf|eot|woff|woff2|png|jpg|jpeg|gif)$/,
          use: [fileLoader()],
        },
        {
          test: /\.styl$/,
          use: [extractCssLoader(), cssLoader(), postcssLoader(), 'stylus-loader'],
        },
        {
          test: /\.css$/,
          use: [extractCssLoader(), cssLoader(), postcssLoader()],
        },
      ],
    },
    optimization: {
      splitChunks: {
        minChunks: 2,
      },
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new FriendlyErrorsPlugin(),
      new ExtractCssPlugin({
        filename: '[name].css?[contenthash:10]',
      }),
      new webpack.LoaderOptionsPlugin({
        test: /\.styl$/,
        stylus: {
          default: {
            preferPathResolver: 'webpack',
            use: [require('rupture')()], // eslint-disable-line global-require
            import: ['~vj/common/common.inc.styl'],
          },
        },
      }),
      ...env.production
        ? [
          new OptimizeCssAssetsPlugin(),
          new webpack.optimize.ModuleConcatenationPlugin(),
          new webpack.LoaderOptionsPlugin({ minimize: true }),
          new webpack.HashedModuleIdsPlugin(),
        ]
        : [new webpack.NamedModulesPlugin()],
      new webpack.LoaderOptionsPlugin({
        options: {
          context: root(),
          customInterpolateName: (url) => beautifyOutputUrl(url),
        },
      }),
    ],
  };

  return config;
}
