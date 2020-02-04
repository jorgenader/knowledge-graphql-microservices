import { buildUrlCache, NamedRouteConfig } from 'tg-named-routes';

import App from '@frontend-core/containers/AppShell';
import PageNotFound from '@frontend-core/views/PageNotFound';
import { createAuthenticationRoutes } from '@frontend-app/auth/routes';
import { createLandingRoutes } from '@frontend-app/shopping-list/routes';

const NotFoundRoute: NamedRouteConfig = {
    name: '404',
    path: '*',
    component: PageNotFound,
};

const routeConfig: NamedRouteConfig[] = [
    {
        component: App,
        routes: [
            createLandingRoutes(NotFoundRoute),
            createAuthenticationRoutes(NotFoundRoute),
            NotFoundRoute,
        ],
    },
];

buildUrlCache(routeConfig);

export const routes = routeConfig;
