/* eslint-disable */
'use strict';

const fs = require('fs');
const eol = require('eol');
const path = require('path');
const VirtualFile = require('vinyl');
const typescriptTransform = require('i18next-scanner-typescript');

const i18nSettings = require('./i18n.json');

const appDir = path.resolve(__dirname);


module.exports = {
    input: [
        'src/**/*.{ts,tsx}',
    ],
    output: './public/locales',
    options: {
        plural: true,
        removeUnusedKeys: false,
        sort: true,
        attr: { extensions: [] },
        func: {
            list: ['_', '__', 'i18next.t', 'i18n.t', 't'],
            extensions: [],
        },
        trans: {
            component: 'Trans',
            i18nKey: 'i18nKey',
            defaultsKey: 'defaults',
            fallbackKey: (ns, value) => value,
            extensions: [],
        },
        lngs: i18nSettings.LANGUAGE_ORDER,
        ns: i18nSettings.TRANSLATION_NAMESPACES,
        defaultLng: i18nSettings.DEFAULT_LANGUAGE,
        defaultNs: i18nSettings.DEFAULT_NAMESPACE,
        defaultValue: '',
        resource: {
            loadPath: '{{lng}}/{{ns}}.json',
            savePath: '{{lng}}/{{ns}}.json',
            jsonIndent: 2,
            lineEnding: '\n',
        },
        nsSeparator: ':',
        keySeparator: '.',
        contextSeparator: '_',
        interpolation: {
            prefix: '{{',
            suffix: '}}',
        },
    },
    transform: typescriptTransform(),
    flush(done) {
        const { parser } = this;
        const { options } = parser;

        // Flush to resource store
        const resStore = parser.get({ sort: options.sort });
        const { jsonIndent } = options.resource;
        const lineEnding = String(options.resource.lineEnding).toLowerCase();

        Object.keys(resStore).forEach((lng) => {
            const namespaces = resStore[lng];

            Object.keys(namespaces).forEach((ns) => {
                const resPath = parser.formatResourceSavePath(lng, ns);
                let resContent;
                try {
                    resContent = JSON.parse(
                        fs.readFileSync(
                            fs.realpathSync(path.join(appDir, 'public', 'locales', resPath)),
                        ).toString('utf-8'),
                    );
                } catch (e) {
                    resContent = {};
                }
                const obj = { ...namespaces[ns], ...resContent };
                let text = JSON.stringify(obj, null, jsonIndent) + '\n';

                if (lineEnding === 'auto') {
                    text = eol.auto(text);
                } else if (lineEnding === '\r\n' || lineEnding === 'crlf') {
                    text = eol.crlf(text);
                } else if (lineEnding === '\n' || lineEnding === 'lf') {
                    text = eol.lf(text);
                } else if (lineEnding === '\r' || lineEnding === 'cr') {
                    text = eol.cr(text);
                } else { // Defaults to LF
                    text = eol.lf(text);
                }

                let contents = null;

                try {
                    // "Buffer.from(string[, encoding])" is added in Node.js v5.10.0
                    contents = Buffer.from(text);
                } catch (e) {
                    // Fallback to "new Buffer(string[, encoding])" which is deprecated since Node.js v6.0.0
                    contents = new Buffer(text);
                }

                this.push(new VirtualFile({
                    path: resPath,
                    contents: contents,
                }));
            });
        });

        done();
    },
};
