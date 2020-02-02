import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SETTINGS } from '@frontend-app/settings';

interface DefaultHeaderProps {
    canonical: string;
}

const Header: FC<DefaultHeaderProps> = ({ canonical }) => {
    const { i18n } = useTranslation();

    return (
        <Helmet
            titleTemplate="%s - Shopping lists"
            defaultTitle="Shopping lists"
        >
            <html lang={i18n.language} />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet="utf-8" />
            <body className="bg-light" />
            <meta name="description" content="Default description" />
            <link rel="canonical" href={`${SETTINGS.SITE_URL}${canonical}`} />
        </Helmet>
    );
};

export default Header;
