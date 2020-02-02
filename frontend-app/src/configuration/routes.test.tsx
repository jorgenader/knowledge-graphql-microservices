// tslint:disable-next-line:no-implicit-dependencies
import { render } from '@testing-library/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { RenderChildren, resolvePath } from 'tg-named-routes';

import i18next from './i18n-test';
import { routes } from './routes';

describe('route config', () => {
    test('Render does not break', () => {
        render(
            <MemoryRouter initialEntries={[resolvePath('landing')]}>
                <HelmetProvider>
                    <I18nextProvider i18n={i18next}>
                        <RenderChildren routes={routes} />
                    </I18nextProvider>
                </HelmetProvider>
            </MemoryRouter>
        );
    });
});
