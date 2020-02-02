import { Button, InputGroup } from '@blueprintjs/core';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { resolvePath } from 'tg-named-routes';
import * as Yup from 'yup';
import { Col, Row } from 'reactstrap';

export interface LoginFormValues {
    email: string;
    password: string;
}

interface LoginFormProps {
    onLogin: (values: LoginFormValues) => Promise<void>;
}

const LoginForm: FC<LoginFormProps> = ({ onLogin }) => {
    const { t } = useTranslation();
    const onSubmit = useCallback(
        async (
            values: LoginFormValues,
            actions: FormikHelpers<LoginFormValues>
        ) => {
            actions.setSubmitting(true);
            try {
                await onLogin(values);
            } catch (e) {
                actions.setStatus(t('auth:login.failedUnknown'));
            }
            actions.setSubmitting(false);
        },
        [onLogin]
    );
    const formRender = useCallback(
        (props: FormikProps<LoginFormValues>) => (
            <form onSubmit={props.handleSubmit}>
                <Row form>
                    <Col>
                        <InputGroup
                            fill
                            placeholder={t('auth:common.email')}
                            name="email"
                            onChange={props.handleChange}
                        />
                        <InputGroup
                            fill
                            placeholder={t('auth:common.password')}
                            name="password"
                            onChange={props.handleChange}
                            type="password"
                            className="pt-2"
                        />
                    </Col>
                </Row>
                <Row form className="pt-3 justify-content-center">
                    <Col lg={6} size={12}>
                        <Button fill type="submit">
                            {t('auth:login.submit')}
                        </Button>
                    </Col>
                </Row>
                <Row form className="pt-3 justify-content-center">
                    <Col lg={6} size={12} className="align-center">
                        <Link to={resolvePath('auth:forgot-password')}>
                            {t('auth:common.forgotPasswordLink')}
                        </Link>
                    </Col>
                </Row>
            </form>
        ),
        [t]
    );
    const validationSchema = useMemo(
        () =>
            Yup.object<LoginFormValues>().shape({
                email: Yup.string()
                    .email(t('auth:common.invalidEmail'))
                    .required(t('auth:common.requiredEmail')),
                password: Yup.string().required(
                    t('auth:common.passwordRequired')
                ),
            }),
        [t]
    );
    return (
        <Formik<LoginFormValues>
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            render={formRender}
        />
    );
};

export default LoginForm;
