import { ApolloProvider } from '@apollo/react-hooks';
import { getDataFromTree } from '@apollo/react-ssr';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import '@tg-resources/fetch-runtime';
import i18next from 'i18next';
import I18NextFSBackend from 'i18next-node-fs-backend';
import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import koaHelmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import koaResponseTime from 'koa-response-time';
import Router from 'koa-router';
import koaServe from 'koa-static';
import * as koaUserAgent from 'koa-useragent';
import React from 'react';
// tslint:disable-next-line:no-submodule-imports
import { renderToString } from 'react-dom/server';
import {
    FilledContext as HelmetContext,
    HelmetProvider,
} from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { StaticRouter, StaticRouterContext } from 'react-router';
import serializeJS from 'serialize-javascript';
import { RenderChildren } from 'tg-named-routes';

import { routes } from '../configuration/routes';
import { AuthProvider } from '../containers/AuthProvider';
import { createApolloClient } from '../services/apollo';
import { getRuntimeConfig, SETTINGS } from '@frontend-app/settings';

import { proxyFactory } from './appProxy';
import errorHandler from './errorHandler';
import {
    koaI18NextMiddleware,
    loadTranslationsHandler,
    missingKeyHandler,
} from './i18n';
import logger from './logger';
import { publicDir, statsFile } from './paths';

i18next
    // Load translations through the filesystem on the server side
    .use(I18NextFSBackend as any)
    // tslint:disable-next-line:no-floating-promises
    .init({
        fallbackLng: SETTINGS.DEFAULT_LANGUAGE,
        load: 'languageOnly', // No region-specific locales (en-US, de-DE, etc.)
        ns: ['translations'],
        defaultNS: 'translations',
        preload: SETTINGS.LANGUAGE_ORDER,
        returnEmptyString: false,
        saveMissing: true,
        saveMissingTo: 'all',
        interpolation: {
            escapeValue: false, // Not needed for React
        },
        react: {
            // Currently Suspense is not server ready
            useSuspense: false,
        },
        backend: {
            loadPath: `${publicDir}/locales/{{lng}}/{{ns}}.json`,
            addPath: `${publicDir}/locales/{{lng}}/{{ns}}.missing.json`,
        },

        // Disable async loading
        initImmediate: false,
    });

// Initialize `koa-router`
const router = new Router();

router.get('/_health', ctx => {
    ctx.status = 200;
    ctx.body = 'OK';
});

// Only enable adding missing keys when not in production
if (process.env.NODE_ENV !== 'production') {
    router.post('/locales/add/:lng/:ns', missingKeyHandler(i18next));
}

// Add multi-loading i18next backend support
router.get('/locales/resources.json', loadTranslationsHandler(i18next));

// Setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
router.get(
    '*',
    async (ctx, next) => {
        const { i18n } = ctx.state;

        const client = createApolloClient();

        // Set the language
        const { language } = ctx.state;
        logger.debug('Set language to: %s', language);
        // logger.debug('Got auth state: %s', authState);

        const extractor = new ChunkExtractor({
            statsFile,
            entrypoints: ['client'],
        });

        const helmetContext = {};
        const context: StaticRouterContext = {};
        const App = (
            <ApolloProvider client={client}>
                <I18nextProvider i18n={i18n}>
                    <HelmetProvider context={helmetContext}>
                        <AuthProvider>
                            <StaticRouter context={context} location={ctx.url}>
                                <RenderChildren routes={routes} />
                            </StaticRouter>
                        </AuthProvider>
                    </HelmetProvider>
                </I18nextProvider>
            </ApolloProvider>
        );

        await getDataFromTree(App);

        ctx.state.markup = renderToString(
            <ChunkExtractorManager extractor={extractor}>
                {App}
            </ChunkExtractorManager>
        );
        ctx.state.helmet = (helmetContext as HelmetContext).helmet;

        if (context.url) {
            return ctx.redirect(context.url);
        }

        // Provide script tags forward
        ctx.state.statusCode = context.statusCode;
        ctx.state.linkTags = extractor.getLinkTags();
        ctx.state.scriptTags = extractor.getScriptTags();
        ctx.state.styleTags = extractor.getStyleTags();

        // Serialize i18next store
        const initialI18nStore = i18n.languages.reduce(
            (acc: any, lng: string) => ({
                ...acc,
                [lng]: i18n.services.resourceStore.data[lng],
            }),
            {}
        );
        ctx.state.initialI18nStore = serializeJS(initialI18nStore);
        ctx.state.initialApolloStore = serializeJS(client.extract());
        ctx.state.runtimeConfig = serializeJS(getRuntimeConfig());

        return next();
    },
    (ctx, next) => {
        ctx.status = ctx.state.statusCode || 200;
        ctx.body = `<!doctype html>
        <html ${ctx.state.helmet.htmlAttributes.toString()}>
        <head>
            ${ctx.state.helmet.title.toString()}
            ${ctx.state.helmet.link.toString()}
            ${ctx.state.helmet.meta.toString()}
            ${ctx.state.helmet.style.toString()}
            ${ctx.state.linkTags}
            ${ctx.state.styleTags}
        </head>
        <body ${ctx.state.helmet.bodyAttributes.toString()}>
            <div id="root">${ctx.state.markup}</div>
            ${ctx.state.scriptTags}
            <script>
                window.__settings__ = ${ctx.state.runtimeConfig};
                window.__initial_i18n_store__ = ${ctx.state.initialI18nStore};
                window.__APOLLO_STATE__ = ${ctx.state.initialApolloStore};
                window.__initial_language__ = '${ctx.state.language}';
            </script>
        </body>
    </html>`;
        return next();
    }
);

const server = new Koa();

if (process.env.NODE_ENV !== 'production') {
    server.use(koaLogger((str, args) => logger.info(str, args)));
} else {
    // Tell Koa to trust proxy headers
    server.proxy = true;
}

proxyFactory(server, SETTINGS.APP_PROXY);

server
    .use(errorHandler(process.env.RAZZLE_SENTRY_PRIVATE_DSN))
    // Add response time to headers
    .use(koaResponseTime())
    // Add user agent parsing
    .use(koaUserAgent.userAgent)
    // `koa-helmet` provides security headers to help prevent common, well known attacks
    // @see https://helmetjs.github.io/
    .use(koaHelmet())
    // Parse body of the request, required for adding missing translations
    .use(koaBody())
    // Process language to context state
    .use(koaI18NextMiddleware(i18next))
    // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
    .use(koaServe(process.env.RAZZLE_PUBLIC_DIR as string))
    .use(router.routes())
    .use(router.allowedMethods());

export default server;
