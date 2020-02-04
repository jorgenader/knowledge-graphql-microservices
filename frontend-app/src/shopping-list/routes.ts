import loadable from '@loadable/component';
import { NamedRouteConfig } from 'tg-named-routes';

const ShoppingListsView = loadable(() =>
    import('@frontend-app/shopping-list/views/ShoppingLists')
);

export const createLandingRoutes = (
    PageNotFoundRoute: NamedRouteConfig
): NamedRouteConfig => ({
    path: '/',
    name: 'landing',
    exact: true,
    component: ShoppingListsView,
});
