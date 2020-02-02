import * as Sentry from '@sentry/browser';
import React, { Component, ErrorInfo, ReactNode } from 'react';

import {
    ErrorComponent,
    ErrorComponentProps,
} from '../components/ErrorComponent';

type ErrorStateType = Pick<ErrorComponentProps, 'error' | 'errorInfo'> | null;

export interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    error: ErrorStateType;
}

const onComponentError = (error: Error, errorInfo: ErrorInfo) => {
    if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(error);
    } else {
        console.error(error);

        if (errorInfo) {
            console.error(errorInfo);
        }
    }
};

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    public state: ErrorBoundaryState = {
        error: null,
    };

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Catch errors in any components below and re-render with error message
        this.onError(error, errorInfo);
    }

    public onError = (error: Error, errorInfo: ErrorInfo) => {
        this.setState({ error: { error, errorInfo } });
        onComponentError(error, errorInfo);
    };

    public resetError = () => {
        this.setState({ error: null });
    };

    public render() {
        const { children } = this.props;

        if (this.state.error) {
            return (
                <ErrorComponent
                    error={this.state.error.error}
                    errorInfo={this.state.error.errorInfo}
                    resetError={this.resetError}
                />
            );
        }

        return children;
    }
}
