import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Card, Col, Container, Row } from 'reactstrap';

const AuthLayout: FC = ({ children }) => {
    const { t } = useTranslation();
    return (
        <>
            <Helmet defaultTitle={t('auth:common.defaultTitle')} />
            <Container>
                <Row>
                    <Col lg={8} className="py-5 ml-auto mr-auto">
                        <Card body>
                            <Row>
                                <Col>
                                    <h3 className="text-center">
                                        {t('auth:common.defaultTitle')}
                                    </h3>
                                </Col>
                            </Row>
                            {children}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AuthLayout;
