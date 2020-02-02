import { ObjectMap } from './utils/types';

// tslint:disable-next-line:no-var-requires
const i18nSettings = require('../i18n.json');

// Declare window value is undefined in some cases
// TSLint detects that window is always defined otherwise
declare var window:
    | Window & {
          __settings__?: Settings;
      }
    | undefined;

const parseBool = (
    value: string | undefined | boolean,
    defaultValue = false
) => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (!value) {
        return defaultValue;
    }
    return /^(1|true|yes)$/i.test(value);
};

const parseString = (value: string | undefined, defaultValue: string) => {
    if (!value) {
        return defaultValue;
    }
    return `${value}`;
};

const parseNumber = (
    value: number | string | undefined,
    defaultValue: number
) => {
    if (typeof value === 'number') {
        return value;
    }
    if (!value) {
        return defaultValue;
    }
    if (/^d+$/.test(value)) {
        return parseInt(value, 10);
    }
    return defaultValue;
};

interface Settings {
    __VERSION__: string;
    API_BASE: string;
    AUTH_REFRESH_TOKEN_NAME: string;
    AUTH_TOKEN_LIFETIME: number;
    AUTH_TOKEN_NAME: string;

    BACKEND_SITE_URL: string;
    DJANGO_URL_PREFIX: string;
    DJANGO_MEDIA_URL: string;
    DJANGO_STATIC_URL: string;
    DJANGO_ADMIN_PANEL: string;
    SITE_URL: string;

    CLUSTERED?: boolean;

    DEBUG: boolean;

    DEFAULT_LANGUAGE: string;
    FALLBACK_LANGUAGE: string;
    LANGUAGE_COOKIE_NAME: string;
    FILE_LOGGING: boolean;
    LANGUAGES: ObjectMap<string>;
    LANGUAGE_ORDER: string[];

    LOGGING_DIR: string;
    LOGGING_FILE_PREFIX: string;
    MAX_WORKERS: number;

    APP_PROXY: ObjectMap<string>;

    SENTRY_PUBLIC_DSN?: string;
    SENTRY_PRIVATE_DSN?: string;

    DEFAULT_NAMESPACE: string;
    TRANSLATION_NAMESPACES: string[];

    WORKER_ID?: number;
}

type RuntimeConfig = Pick<
    Settings,
    '__VERSION__' | 'BACKEND_SITE_URL' | 'SITE_URL' | 'SENTRY_PUBLIC_DSN'
>;

const settings: Settings = {
    __VERSION__: process.env.RAZZLE_COMMIT_HASH || '-',
    API_BASE: '/graphql',
    BACKEND_SITE_URL: parseString(
        process.env.RAZZLE_BACKEND_SITE_URL,
        'http://todo.com'
    ),
    DEBUG:
        process.env.NODE_ENV !== 'production'
            ? true
            : parseBool(process.env.VERBOSE),
    DEFAULT_LANGUAGE: '',
    DEFAULT_NAMESPACE: '',
    DJANGO_URL_PREFIX: '/d/',
    DJANGO_MEDIA_URL: '/media/',
    DJANGO_STATIC_URL: '/assets/',
    DJANGO_ADMIN_PANEL: '/tagauks/',
    FALLBACK_LANGUAGE: '',
    LANGUAGES: {},
    LANGUAGE_COOKIE_NAME: 'knowledge_graphql_microservices_language',
    LANGUAGE_ORDER: [],
    SENTRY_PUBLIC_DSN: process.env.RAZZLE_SENTRY_PUBLIC_DSN,
    SITE_URL: process.env.RAZZLE_SITE_URL,
    TRANSLATION_NAMESPACES: [],

    // Overwrite client settings from server runtime
    ...((typeof window !== 'undefined' && window.__settings__) || {}),

    // Define settings and load from base JSON
    ...i18nSettings,
};

if (process.env.BUILD_TARGET === 'server') {
    settings.CLUSTERED = false;
    settings.FILE_LOGGING = parseBool(process.env.RAZZLE_FILE_LOGGING, true);
    settings.LOGGING_DIR = process.env.RAZZLE_LOGGING_DIR || '/app/logs/';
    settings.LOGGING_FILE_PREFIX =
        process.env.RAZZLE_LOGGING_FILE_PREFIX || 'node';
    settings.MAX_WORKERS = parseNumber(process.env.RAZZLE_MAX_WORKERS, 4);

    if (process.env.NODE_ENV === 'production') {
        // tslint:disable-next-line:no-var-requires
        const cluster = require('cluster');
        if (cluster.isWorker) {
            settings.CLUSTERED = true;
            settings.WORKER_ID = cluster.worker.id;
        }
    } else {
        settings.APP_PROXY = {
            [settings.API_BASE]: settings.BACKEND_SITE_URL,
            [settings.DJANGO_URL_PREFIX]: settings.BACKEND_SITE_URL,
            [settings.DJANGO_MEDIA_URL]: settings.BACKEND_SITE_URL,
            [settings.DJANGO_STATIC_URL]: settings.BACKEND_SITE_URL,
            [settings.DJANGO_ADMIN_PANEL]: settings.BACKEND_SITE_URL,
        };
    }
}

export const getRuntimeConfig = (): RuntimeConfig => {
    const { __VERSION__, SITE_URL, SENTRY_PUBLIC_DSN } = settings;
    return {
        __VERSION__,
        BACKEND_SITE_URL: parseString(process.env.RAZZLE_BACKEND_SITE_URL, ''),
        SITE_URL,
        SENTRY_PUBLIC_DSN,
    };
};

export const SETTINGS = Object.freeze(settings);
