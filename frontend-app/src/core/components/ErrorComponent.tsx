import { PageError } from '@thorgate/spa-components';
import React, { ComponentClass, ErrorInfo, FC, Fragment } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

export interface ErrorComponentProps {
    error: Error;
    errorInfo?: ErrorInfo;
    resetError?: () => void;
}

const DefaultErrorHandler: FC<ErrorComponentProps & RouteComponentProps> = ({
    error,
    errorInfo,
    resetError,
    history,
}) => (
    <PageError statusCode={500}>
        <div>{error.message}</div>
        {process.env.NODE_ENV !== 'production' ? (
            <Fragment>
                {errorInfo ? <pre>{errorInfo.componentStack}</pre> : null}
                <pre>{error.stack}</pre>
            </Fragment>
        ) : null}
        <button onClick={() => history.goBack()}>Go back</button>
        &nbsp;or&nbsp;
        {resetError ? (
            <button onClick={() => resetError()}>Try again</button>
        ) : (
            <button onClick={() => window.location.reload()}>
                Reload the page
            </button>
        )}
    </PageError>
);

export const ErrorComponent: ComponentClass<ErrorComponentProps> = withRouter(
    DefaultErrorHandler
);
