/* Client-side translation configuration */
import i18next from 'i18next';
import i18nFetchBackend from 'i18next-fetch-backend';
import { initReactI18next } from 'react-i18next';

import { SETTINGS } from '@frontend-app/settings';

i18next.use(i18nFetchBackend).use(initReactI18next as any); // Need to define as any - type not accepted

export const setupI18Next = async (language: string) => {
    if (!i18next.isInitialized) {
        // Initialize with default options while setting language as well
        await i18next.init({
            lng: language,
            load: 'languageOnly',
            fallbackLng: SETTINGS.DEFAULT_LANGUAGE,
            ns: SETTINGS.TRANSLATION_NAMESPACES,
            defaultNS: SETTINGS.DEFAULT_NAMESPACE,
            returnEmptyString: false,
            saveMissing: true,
            saveMissingTo: 'all',
            debug: SETTINGS.DEBUG,
            interpolation: {
                escapeValue: false, // Not needed for React
            },
            react: {
                // Currently Suspense is not server ready
                useSuspense: false,
                // Client-side always waits for translations
                wait: true,
            },
            backend: {
                multiSeparator: '+',
                allowMultiLoading: true,
                loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}',

                requestOptions: {
                    mode: 'cors',
                    credentials: 'same-origin',
                    cache: 'default',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            },
        });
    }

    return i18next;
};
