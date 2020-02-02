import { PageError } from '@thorgate/spa-components';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <PageError
            statusCode={404}
            title={t('common:pageNotFound.title')}
            description={t('common:pageNotFound.description')}
        />
    );
};

export default NotFound;
