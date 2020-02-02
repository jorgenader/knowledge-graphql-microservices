import React, { FC } from 'react';
import {
    NamedRouteConfigComponentProps,
    RenderChildren,
} from 'tg-named-routes';

// Load main styles
import Header from '@frontend-core/components/Header';
import NavigationBar from '@frontend-core/components/NavigationBar';
import '@frontend-app/styles/main.scss';

import { ErrorBoundary } from './ErrorBoundary';

const App = ({ route, match }: NamedRouteConfigComponentProps) => (
    <>
        <Header canonical={match.url} />
        <NavigationBar />
        <ErrorBoundary>
            <RenderChildren route={route} />
        </ErrorBoundary>
    </>
);

export default App;
