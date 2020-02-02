import { PageError } from '@thorgate/spa-components';
import React from 'react';
import { useTranslation } from 'react-i18next';

const PermissionDenied = () => {
    const { t } = useTranslation();
    return (
        <PageError
            statusCode={403}
            title={t('common:permissionDenied.title')}
            description={t('common:permissionDenied.description')}
        />
    );
};

export default PermissionDenied;
