import React, { Component, ComponentClass, ReactNode } from 'react';
import { withRouter } from 'react-router';
import { NamedRouteConfigComponentProps } from 'tg-named-routes';

import { SafeStorage } from '@frontend-app/utils/Storage';
import { User } from '@frontend-app/utils/types';
import {
    getSessionStorage,
    windowPageOffset,
    windowScroll,
} from '@frontend-app/utils/Window';

declare var window: Window | undefined;

interface ViewBaseSnapshot {
    locationUpdate?: boolean;
    userUpdate?: boolean;
}

type ViewSnapshot = ViewBaseSnapshot | null;

export type UserUpdateCallback = (user: User | null) => void;

export interface ViewProps {
    className?: string | null;

    isAuthenticated: boolean;
    user: User | null;

    onUserUpdate?: UserUpdateCallback;

    children: ReactNode;
}

type ViewInternalProps = ViewProps & NamedRouteConfigComponentProps;

function shouldHandleScrollRestoration(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return (
        window.history &&
        window.history.scrollRestoration &&
        window.history.scrollRestoration !== 'auto'
    );
}

class ViewBase extends Component<ViewInternalProps, never, ViewSnapshot> {
    public static defaultProps = {
        children: null,
        className: null,
    };

    protected sessionStorage: SafeStorage = getSessionStorage();
    protected static shouldHandleScrollRestoration = shouldHandleScrollRestoration();

    public componentDidMount() {
        this.restoreScrollPosition();
    }

    public getSnapshotBeforeUpdate(prevProps: ViewInternalProps): ViewSnapshot {
        let snapshot: ViewSnapshot = null;

        if (prevProps.location.key !== this.props.location.key) {
            snapshot = {
                locationUpdate: true,
            };
        }

        if (prevProps.user !== this.props.user) {
            if (!snapshot) {
                snapshot = {};
            }

            snapshot.userUpdate = true;
        }

        return snapshot;
    }

    public componentDidUpdate(_: never, _1: never, snapshot: ViewSnapshot) {
        if (snapshot !== null) {
            const { locationUpdate, userUpdate } = snapshot;

            if (locationUpdate) {
                this.rememberScrollPosition();
                this.restoreScrollPosition();
            }

            if (userUpdate && this.props.onUserUpdate) {
                this.props.onUserUpdate(this.props.user);
            }
        }
    }

    public componentWillUnmount() {
        this.rememberScrollPosition();
    }

    public render() {
        const { children } = this.props;
        let content: ReactNode = children;
        if (this.props.className) {
            content = <div className={this.props.className}>{children}</div>;
        }

        return <div>{content}</div>;
    }

    protected restoreScrollPosition = () => {
        if (!ViewBase.shouldHandleScrollRestoration) {
            return;
        }

        const {
            history: { action },
            location: { key = 'root', hash },
        } = this.props;
        let scrollToTop = hash.length === 0;

        // POP means user is going forward or backward in history, restore previous scroll position
        if (action === 'POP') {
            const pos = this.sessionStorage.getItem(
                `View.scrollPositions.${key}`
            );
            if (pos) {
                const [posX, posY] = pos.split(';');

                let x = parseInt(posX, 10);
                let y = parseInt(posY, 10);

                if (isNaN(x)) {
                    x = 0;
                }

                if (isNaN(y)) {
                    y = 0;
                }

                windowScroll(x, y);
                scrollToTop = false;
            }
        }

        if (scrollToTop) {
            // Scroll to top of viewport
            windowScroll(0, 0);
        }
    };

    protected rememberScrollPosition = () => {
        if (!ViewBase.shouldHandleScrollRestoration) {
            return;
        }

        // Remember scroll position so we can restore if we return to this view via browser history
        const {
            location: { key = 'root' },
        } = this.props;
        const [x, y] = windowPageOffset();

        this.sessionStorage.setItem(`View.scrollPositions.${key}`, `${x};${y}`);
    };
}

export const View: ComponentClass<ViewProps> = withRouter(ViewBase);
