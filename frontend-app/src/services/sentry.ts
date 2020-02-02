import * as Sentry from '@sentry/browser';
import { ErrorInfo } from 'react';

export const onComponentError = (error: Error, errorInfo: ErrorInfo) => {
    if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(error);
    } else {
        // eslint-disable-next-line no-console
        console.error(error);

        if (errorInfo) {
            // eslint-disable-next-line no-console
            console.error(errorInfo);
        }
    }
};
