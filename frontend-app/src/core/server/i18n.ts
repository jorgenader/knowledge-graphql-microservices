import addYears from 'date-fns/addYears';
import I18Next from 'i18next';
import Koa from 'koa';
import KoaRouter from 'koa-router';

import { SETTINGS } from '@frontend-app/settings';

import logger from './logger';

type I18NextInstance = typeof I18Next;

function setPath(object: any, path: any, newValue: any) {
    /* eslint-disable no-param-reassign */
    let stack: any;
    if (typeof path !== 'string') {
        stack = [].concat(path);
    }

    if (typeof path === 'string') {
        stack = path.split('.');
    }

    while (stack.length > 1) {
        let key: string = stack.shift();
        if (key.indexOf('###') > -1) {
            key = key.replace(/###/g, '.');
        }
        if (!object[key]) {
            object[key] = {};
        }
        object = object[key];
    }

    let keyStack = stack.shift();
    if (keyStack.indexOf('###') > -1) {
        keyStack = keyStack.replace(/###/g, '.');
    }

    object[keyStack] = newValue;
    /* eslint-enable no-param-reassign */
}

export interface TranslationLoaderOptions {
    maxAge?: number;
    cache?: boolean;
    lngParam?: string;
    nsParam?: string;
}

export const loadTranslationsHandler = (
    i18next: I18NextInstance,
    options?: TranslationLoaderOptions
): KoaRouter.IMiddleware => {
    const {
        maxAge = 60 * 60 * 24 * 30,
        cache = process.env.NODE_ENV === 'production',
        lngParam = 'lng',
        nsParam = 'ns',
    } = options || {};

    return ctx => {
        if (!i18next.services.backendConnector) {
            ctx.status = 400;
            ctx.body = 'i18next-middleware:: no backend configured';
            return;
        }

        const resources = {};

        // Response is JSON
        ctx.type = 'application/json';

        if (cache) {
            ctx.set('Cache-Control', `public, max-age=${maxAge}`);
            ctx.set(
                'Expires',
                new Date(new Date().getTime() + maxAge * 1000).toUTCString()
            );
        } else {
            ctx.set('Pragma', 'no-cache');
            ctx.set('Cache-Control', 'no-cache');
        }

        const languages: string[] = ctx.query[lngParam]
            ? ctx.query[lngParam].split(' ')
            : [];
        const namespaces: string[] = ctx.query[nsParam]
            ? ctx.query[nsParam].split(' ')
            : [];

        // extend ns
        namespaces.forEach(ns => {
            if (!Array.isArray(i18next.options.ns)) {
                i18next.options.ns =
                    typeof i18next.options.ns === 'string'
                        ? [i18next.options.ns]
                        : [];
            }
            if (i18next.options.ns && i18next.options.ns.indexOf(ns) < 0) {
                i18next.options.ns.push(ns);
            }
        });

        i18next.services.backendConnector.load(languages, namespaces, () => {
            languages.forEach(lng => {
                namespaces.forEach(ns => {
                    setPath(
                        resources,
                        [lng, ns],
                        i18next.getResourceBundle(lng, ns)
                    );
                });
            });

            ctx.body = resources;
        });
    };
};

type MissingKeyHandlerOptions = Pick<
    TranslationLoaderOptions,
    'lngParam' | 'nsParam'
>;

export const missingKeyHandler = (
    i18next: I18NextInstance,
    options?: MissingKeyHandlerOptions
): KoaRouter.IMiddleware => {
    const { lngParam = 'lng', nsParam = 'ns' } = options || {};

    return ctx => {
        const lng = ctx.params[lngParam];
        const ns = ctx.params[nsParam];
        const { body } = ctx.request;

        if (!i18next.services.backendConnector) {
            ctx.status = 400;
            ctx.body = 'i18next-middleware:: no backend configured';
            return;
        }

        Object.keys(body).forEach(field => {
            if (field === '_t') {
                // XHR backend sends a timestamp which we don't want to save
                return;
            }

            i18next.services.backendConnector.saveMissing(
                [lng],
                ns,
                field,
                body[field]
            );
        });

        ctx.status = 200;
        ctx.body = 'ok';
    };
};

export const koaI18NextMiddleware = (
    i18next: I18NextInstance
): Koa.Middleware<
    { i18n: I18NextInstance; language: string; languages: string[] },
    any
> => async (ctx, next) => {
    const language =
        ctx.cookies.get(SETTINGS.LANGUAGE_COOKIE_NAME) ||
        SETTINGS.DEFAULT_LANGUAGE;

    logger.debug('Language: %s', language);
    ctx.cookies.set(SETTINGS.LANGUAGE_COOKIE_NAME, language, {
        expires: addYears(new Date(), 1),
        httpOnly: false,
    });

    const i18n = i18next.cloneInstance({ initImmediate: false });
    ctx.state.i18n = i18n;

    ctx.state.language = language;
    ctx.state.languages = i18next.services.languageUtils.toResolveHierarchy(
        language
    );

    await i18n.changeLanguage(language);

    // Bind translation functions for template
    ctx.state.t = i18n.t.bind(i18n);
    ctx.state.exists = i18n.exists.bind(i18n);

    return next();
};
