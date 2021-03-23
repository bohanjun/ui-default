module.exports = {
  plugins: [
    'lodash',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-json-strings',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    [
      'prismjs',
      {
        languages: [
          'clike',
          'c',
          'cpp',
          'pascal',
          'java',
          'python',
          'java',
          'python',
          'php',
          'rust',
          'haskell',
          'javascript',
          'go',
          'ruby',
          'csharp',
        ],
        plugins: [
          'toolbar',
          'line-numbers',
        ],
        css: true,
      },
    ],
  ],
  presets: [
    ['@babel/preset-env', { loose: true, modules: false }],
    '@babel/preset-react',
  ],
};
