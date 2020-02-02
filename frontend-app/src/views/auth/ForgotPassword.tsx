import React, { FC, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { withView } from '@frontend-app/decorators';
import ForgotPasswordForm, {
    ForgotPasswordFormValues,
} from '@frontend-app/forms/auth/ForgotPassword';
import AuthLayout from '@frontend-app/layouts/AuthLayout';
import { wait } from '@frontend-app/utils/wait';

const ForgotPassword: FC = () => {
    const { t } = useTranslation();
    const onForgotPassword = useCallback(
        async (values: ForgotPasswordFormValues) => {
            await wait(200);
        },
        []
    );
    return (
        <AuthLayout>
            <Helmet title={t('auth:header.forgotPassword')} />
            <ForgotPasswordForm onForgotPassword={onForgotPassword} />
        </AuthLayout>
    );
};

const ForgotPasswordView = withView()(ForgotPassword);

export default ForgotPasswordView;
