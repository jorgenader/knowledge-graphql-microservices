import { Alert, Button, InputGroup } from '@blueprintjs/core';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { resolvePath } from 'tg-named-routes';
import * as Yup from 'yup';

export interface ForgotPasswordFormValues {
    email: string;
}

interface ForgotPasswordFormProps {
    onForgotPassword: (values: ForgotPasswordFormValues) => Promise<void>;
}

// TODO: STYLES
const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
    onForgotPassword,
}) => {
    const { t } = useTranslation();
    const onSubmit = useCallback(
        async (
            values: ForgotPasswordFormValues,
            actions: FormikHelpers<ForgotPasswordFormValues>
        ) => {
            actions.setSubmitting(true);
            try {
                await onForgotPassword(values);
                actions.setStatus({ success: true });
            } catch (e) {
                actions.setStatus(t('auth:forgotPassword.failedUnknown'));
            }
            actions.setSubmitting(false);
        },
        [onForgotPassword]
    );
    const formRender = useCallback(
        (props: FormikProps<ForgotPasswordFormValues>) => {
            const { email } = props.values;
            return (
                <form onSubmit={props.handleSubmit}>
                    {props.status.success ? (
                        <Alert>
                            <Trans i18nKey="auth:forgotPassword.emailSent">
                                We have sent you an email to{' '}
                                <strong>{{ email }}</strong> with a link to
                                reset your password
                            </Trans>
                        </Alert>
                    ) : (
                        <>
                            <InputGroup
                                name="email"
                                onChange={props.handleChange}
                            />
                            <Button fill type="submit">
                                {t('auth:forgotPassword.submit')}
                            </Button>
                        </>
                    )}
                    <Link to={resolvePath('auth:login')}>
                        {t('auth:common.backToLogin')}
                    </Link>
                </form>
            );
        },
        [t]
    );
    const validationSchema = useMemo(
        () =>
            Yup.object<ForgotPasswordFormValues>().shape({
                email: Yup.string()
                    .email(t('auth:common.invalidEmail'))
                    .required(t('auth:common.requiredEmail')),
            }),
        [t]
    );
    return (
        <Formik<ForgotPasswordFormValues>
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            render={formRender}
        />
    );
};

export default ForgotPasswordForm;
