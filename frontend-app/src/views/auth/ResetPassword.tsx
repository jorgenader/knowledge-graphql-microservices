import React, { FC, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { NamedRouteConfigComponentProps } from 'tg-named-routes';

import { withView } from '@frontend-app/decorators';
import ResetPasswordForm, {
    ResetPasswordFormValues,
} from '@frontend-app/forms/auth/ResetPassword';
import AuthLayout from '@frontend-app/layouts/AuthLayout';
import { wait } from '@frontend-app/utils/wait';

const ResetPassword: FC<NamedRouteConfigComponentProps<{ token: string }>> = ({
    match,
}) => {
    const { t } = useTranslation();
    const onResetPassword = useCallback(
        async (values: ResetPasswordFormValues) => {
            await wait(300);
        },
        []
    );
    return (
        <AuthLayout>
            <Helmet title={t('auth:header.resetPassword')} />
            <ResetPasswordForm
                token={match.params.token}
                onResetPassword={onResetPassword}
            />
        </AuthLayout>
    );
};

const ResetPasswordView = withView()(ResetPassword);

export default ResetPasswordView;
