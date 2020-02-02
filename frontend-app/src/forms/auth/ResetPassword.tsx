import { Alert, Button, InputGroup } from '@blueprintjs/core';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { resolvePath } from 'tg-named-routes';
import * as Yup from 'yup';

export interface ResetPasswordFormValues {
    token: string;
    password: string;
    passwordConfirm: string;
}

interface ResetPasswordFormProps {
    token: string;
    onResetPassword: (values: ResetPasswordFormValues) => Promise<void>;
}

const ResetPasswordFormProps: FC<ResetPasswordFormProps> = ({
    onResetPassword,
    token,
}) => {
    const { t } = useTranslation();
    const onSubmit = useCallback(
        async (
            values: ResetPasswordFormValues,
            actions: FormikHelpers<ResetPasswordFormValues>
        ) => {
            actions.setSubmitting(true);
            try {
                await onResetPassword(values);
                actions.setStatus({ success: true });
            } catch (e) {
                actions.setStatus(t('auth:resetPassword.failedUnknown'));
            }
            actions.setSubmitting(false);
        },
        [onResetPassword]
    );
    const formRender = useCallback(
        (props: FormikProps<ResetPasswordFormValues>) => (
            <form onSubmit={props.handleSubmit}>
                {props.status.success ? (
                    <Alert>
                        <Trans>
                            Your password has been reset. Try to login with it
                            now.
                        </Trans>
                    </Alert>
                ) : (
                    <>
                        <InputGroup
                            name="password"
                            type="password"
                            onChange={props.handleChange}
                        />
                        <InputGroup
                            name="passwordConfirm"
                            type="password"
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
        ),
        [t]
    );
    const validationSchema = useMemo(
        () =>
            Yup.object<ResetPasswordFormValues>().shape({
                password: Yup.string().required(
                    t('auth:common.passwordRequired')
                ),
                passwordConfirm: Yup.string()
                    .required(t('auth:common.passwordConfirmRequired'))
                    .test(
                        'password-match',
                        t('auth:common.passwordConfirmNotMatching'),
                        function passwordTest(value: string) {
                            const { password } = this.parent;
                            return password === value;
                        }
                    ),
            }),
        [t]
    );
    return (
        <Formik<ResetPasswordFormValues>
            initialValues={{ password: '', passwordConfirm: '', token }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            render={formRender}
        />
    );
};

export default ResetPasswordFormProps;
