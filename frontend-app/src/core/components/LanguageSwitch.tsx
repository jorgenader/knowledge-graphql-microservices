import { Button } from '@blueprintjs/core';
import Cookies from 'js-cookie';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { SETTINGS } from '@frontend-app/settings';

const LanguageSwitch = () => {
    const { i18n } = useTranslation();
    const changeLanguage = useCallback(
        async (language: string) => {
            await i18n.changeLanguage(language);
            Cookies.set(SETTINGS.LANGUAGE_COOKIE_NAME, language);
        },
        [i18n]
    );

    return (
        <>
            <p>Active language: {SETTINGS.LANGUAGES[i18n.language]}</p>
            {SETTINGS.LANGUAGE_ORDER.map(languageCode => (
                <Button
                    key={languageCode}
                    onClick={() => changeLanguage(languageCode)}
                    className="mr-2"
                >
                    {SETTINGS.LANGUAGES[languageCode]}
                </Button>
            ))}
        </>
    );
};

export default LanguageSwitch;
