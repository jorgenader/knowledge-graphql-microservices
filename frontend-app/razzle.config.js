'use strict';
const path = require('path');

const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const paths = require('razzle/config/paths');
const LoadablePlugin = require('@loadable/webpack-plugin');

const cssLoaderFinder = makeLoaderFinder('css-loader');
const fileLoaderFinder = makeLoaderFinder('file-loader');

module.exports = {
    plugins: [
        {
            name: 'typescript',
            options: {
                useBabel: true,
            },
        },
        {
            name: 'long-term-caching',
            options: {
                cachingOptions: 'split-size',
            },
        },
    ],
    modify(baseConfig, secondArg, webpack) {
        const { dev, target } = secondArg;
        /* make a copy of config */
        const config = Object.assign({}, baseConfig);

        const scssLoader = {
            loader: require.resolve('sass-loader'),
            options: {
                sourceMap: dev,
            },
        };

        config.module.rules.filter(cssLoaderFinder).forEach(rule => {
            const isCssModuleRule = !rule.test.test('module.css');

            const scssExclude = [paths.appBuild];
            let scssTest = /\.s[ac]ss$/;
            if (isCssModuleRule) {
                scssTest = /\.module\.s[ac]ss$/;
            } else {
                scssExclude.push(/\.module\.s[ac]ss$/);
            }

            // Use default configs
            config.module.rules.push({
                test: scssTest,
                exclude: scssExclude,
                use: [...rule.use, scssLoader],
            });
        });

        // Add option to load *.graphql files directly
        config.module.rules.push({
            test: /\.graphql$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
        });
        config.module.rules[
            config.module.rules.findIndex(fileLoaderFinder)
        ].exclude.push(/\.graphql$/);

        if (target !== 'node') {
            config.plugins.push(
                new LoadablePlugin({
                    outputAsset: false,
                    writeToDisk: {
                        filename: path.resolve(__dirname, 'build'),
                    },
                })
            );
        }

        // adding ./src to module resolver so I can import modules with absolute paths
        config.resolve.modules.push('./src');
        config.resolve.alias['@frontend-app'] = paths.appSrc;
        config.resolve.alias['@frontend-core'] = `${paths.appSrc}/core`;

        return config;
    },
};
