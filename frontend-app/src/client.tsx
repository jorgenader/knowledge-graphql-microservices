import { ApolloProvider } from '@apollo/react-hooks';
import { loadableReady } from '@loadable/component';
import * as Sentry from '@sentry/browser';
import '@tg-resources/fetch-runtime';
import Cookies from 'js-cookie';
import React, { FC } from 'react';
import { hydrate } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSSR } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { NamedRouteConfig, RenderChildren } from 'tg-named-routes';

import { setupI18Next } from './configuration/i18n';
import { routes } from './configuration/routes';
import { AuthProvider } from './containers/AuthProvider';
import { createApolloClient } from './services/apollo';
import { SETTINGS } from './settings';

// Configure Sentry only in production
if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: SETTINGS.SENTRY_PUBLIC_DSN,
    });
}

declare var window: Window & {
    __initial_language__: any;
    __initial_i18n_store__: any;
    __APOLLO_STATE__: any;
};

const initialLanguage = window.__initial_language__;

// Get correct language from store and cookies
const cookieLanguage = Cookies.get(SETTINGS.LANGUAGE_COOKIE_NAME);

// Get valid language
const currentLanguage =
    initialLanguage || cookieLanguage || SETTINGS.DEFAULT_LANGUAGE;

const appDocumentRoot = document.getElementById('root');

const apolloClient = createApolloClient(window.__APOLLO_STATE__);

const App: FC<{ appRoutes: NamedRouteConfig[] }> = ({ appRoutes }) => {
    useSSR(window.__initial_i18n_store__, initialLanguage);
    return (
        <ApolloProvider client={apolloClient}>
            <HelmetProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <RenderChildren routes={appRoutes} />
                    </BrowserRouter>
                </AuthProvider>
            </HelmetProvider>
        </ApolloProvider>
    );
};

const renderApp = (appRoutes: NamedRouteConfig[]) => {
    hydrate(<App appRoutes={appRoutes} />, appDocumentRoot);
};

async function initReactApp() {
    try {
        await loadableReady();
        await setupI18Next(currentLanguage);
        renderApp(routes);
    } catch (e) {
        Sentry.captureException(e);
    }
}

// tslint:disable-next-line:no-floating-promises
initReactApp();

if (module.hot) {
    module.hot.accept('./configuration/routes', () => {
        renderApp(routes);
    });
}
