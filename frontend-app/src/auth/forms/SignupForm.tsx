import { Alert, Button, InputGroup } from '@blueprintjs/core';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { resolvePath } from 'tg-named-routes';
import * as Yup from 'yup';

export interface SignupFormValues {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

interface SignupFormProps {
    onSignup: (values: SignupFormValues) => Promise<void>;
}

// TODO: STYLES
const SignupForm: FC<SignupFormProps> = ({ onSignup }) => {
    const { t } = useTranslation();
    const onSubmit = useCallback(
        async (
            values: SignupFormValues,
            actions: FormikHelpers<SignupFormValues>
        ) => {
            actions.setSubmitting(true);
            try {
                await onSignup(values);
            } catch (e) {
                actions.setStatus(t('auth:signup.failedUnknown'));
            }
            actions.setSubmitting(false);
        },
        [onSignup]
    );
    const formRender = useCallback(
        (props: FormikProps<SignupFormValues>) => (
            <form onSubmit={props.handleSubmit}>
                {props.status ? (
                    <Alert intent="danger">{props.status}</Alert>
                ) : null}
                <InputGroup fill name="name" onChange={props.handleChange} />
                <InputGroup fill name="email" onChange={props.handleChange} />
                <InputGroup
                    fill
                    name="password"
                    onChange={props.handleChange}
                    type="password"
                />
                <InputGroup
                    fill
                    name="passwordConfirm"
                    onChange={props.handleChange}
                    type="password"
                />
                <Button fill type="submit">
                    {t('auth:signup.submit')}
                </Button>
                <Link to={resolvePath('auth:forgot-password')}>
                    {t('auth:common.forgotPasswordLink')}
                </Link>
            </form>
        ),
        [t]
    );
    const validationSchema = useMemo(
        () =>
            Yup.object<SignupFormValues>().shape({
                name: Yup.string().required(t('auth:common.requiredName')),
                email: Yup.string()
                    .email(t('auth:common.invalidEmail'))
                    .required(t('auth:common.requiredEmail')),
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
        <Formik<SignupFormValues>
            initialValues={{
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            render={formRender}
        />
    );
};

export default SignupForm;
