import qs from 'qs';
import React, { FC, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import { NamedRouteConfigComponentProps, resolvePath } from 'tg-named-routes';

import { withView } from '@frontend-core/decorators';
import { useAuth } from '@frontend-core/hooks';
import SignupForm, {
    SignupFormValues,
} from '@frontend-app/auth/forms/SignupForm';
import AuthLayout from '@frontend-app/auth/AuthLayout';
import { wait } from '@frontend-app/utils/wait';

const Signup: FC<NamedRouteConfigComponentProps> = ({ location }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const onSignup = useCallback(async (values: SignupFormValues) => {
        await wait(300);
    }, []);

    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { permissionDenied } = (location.state || {}) as {
        permissionDenied?: boolean;
    };

    if (user && !permissionDenied) {
        let nextUrl = resolvePath('landing');
        if (query.next && query.next !== resolvePath('auth:login')) {
            nextUrl = query.next;
        }

        return <Redirect to={nextUrl} />;
    }

    return (
        <AuthLayout>
            <Helmet>
                <title>{t('auth:signup.headerTitle')}</title>
            </Helmet>
            <SignupForm onSignup={onSignup} />
        </AuthLayout>
    );
};

const SignUpAsView = withView()(Signup);

export default SignUpAsView;
