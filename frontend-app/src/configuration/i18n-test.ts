/* Client-side translation configuration */
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
    .use(initReactI18next as any) // Need to define as any - type not accepted
    // tslint:disable-next-line:no-floating-promises
    .init({
        lng: 'cimode',
        load: 'languageOnly',
        fallbackLng: 'cimode',
        returnEmptyString: false,
        saveMissing: true,
        saveMissingTo: 'all',
        interpolation: {
            escapeValue: false, // Not needed for React
        },
        react: {
            useSuspense: false,
            wait: false,
            nsMode: 'fallback',
        },
    });

export default i18next;
