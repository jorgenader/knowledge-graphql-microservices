import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { withView } from '@frontend-core/decorators';
import { useAuth } from '@frontend-core/hooks';
import LoginForm from '@frontend-app/auth/forms/LoginForm';
import AuthLayout from '@frontend-app/auth/AuthLayout';

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
