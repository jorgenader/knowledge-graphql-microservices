import loadable from '@loadable/component';
import { buildUrlCache, NamedRouteConfig } from 'tg-named-routes';

import App from '@frontend-core/containers/AppShell';
import PageNotFound from '@frontend-core/views/PageNotFound';
import { createAuthenticationRoutes } from '@frontend-app/auth/routes';

const Home = loadable(() => import('../views/Home'));

const NotFoundRoute: NamedRouteConfig = {
    name: '404',
    path: '*',
    component: PageNotFound,
};

const routeConfig: NamedRouteConfig[] = [
    {
        component: App,
        routes: [
            {
                path: '/',
                exact: true,
                name: 'landing',
                component: Home,
            },
            createAuthenticationRoutes(NotFoundRoute),
            NotFoundRoute,
        ],
    },
];

buildUrlCache(routeConfig);

export const routes = routeConfig;
