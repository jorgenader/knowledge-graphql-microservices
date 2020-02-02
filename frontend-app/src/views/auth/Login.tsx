import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { withView } from '@frontend-app/decorators';
import LoginForm from '@frontend-app/forms/auth/LoginForm';
import { useAuth } from '@frontend-app/hooks';
import AuthLayout from '@frontend-app/layouts/AuthLayout';

const Login = () => {
    const { t } = useTranslation();
    const { login } = useAuth();

    return (
        <AuthLayout>
            <Helmet>
                <title>{t('auth:login.headerTitle')}</title>
            </Helmet>
            <LoginForm onLogin={login} />
        </AuthLayout>
    );
};

const LoginAsView = withView()(Login);

export default LoginAsView;
