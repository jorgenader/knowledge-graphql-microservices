import loadable from '@loadable/component';
import { NamedRouteConfig, RenderChildren } from 'tg-named-routes';

const LoginView = loadable(() => import('@frontend-app/auth/views/Login'));
const SignupView = loadable(() => import('@frontend-app/auth/views/Signup'));
const ForgotPasswordView = loadable(() =>
    import('@frontend-app/auth/views/ForgotPassword')
);
const ResetPasswordView = loadable(() =>
    import('@frontend-app/auth/views/ResetPassword')
);

export const createAuthenticationRoutes = (
    PageNotFoundRoute: NamedRouteConfig
): NamedRouteConfig => ({
    path: '/auth',
    name: 'auth',
    component: RenderChildren,
    routes: [
        {
            path: '/auth/login',
            exact: true,
            name: 'login',
            component: LoginView,
        },
        {
            path: '/auth/signup',
            exact: true,
            name: 'signup',
            component: SignupView,
        },
        {
            path: '/auth/forgot-password',
            exact: true,
            name: 'forgot-password',
            component: ForgotPasswordView,
        },
        {
            path: '/auth/reset-password/:token',
            exact: true,
            name: 'reset-password',
            component: ResetPasswordView,
        },
        {
            path: '/auth/logout',
            exact: true,
            name: 'logout',
            component: () => null,
        },
        PageNotFoundRoute,
    ],
});
