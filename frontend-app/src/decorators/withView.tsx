import React, { ComponentType, FC } from 'react';

import { View, ViewProps } from '../containers/View';
import { useAuth } from '../hooks';

export type ViewDecoratorOptions = Pick<
    ViewProps,
    'className' | 'onUserUpdate'
>;

export const withView = (options: Partial<ViewDecoratorOptions> = {}) =>
    function decorator<P>(Component: ComponentType<P>) {
        const WrappedComponent: FC<P> = props => {
            const { isAuthenticated, user } = useAuth();
            return (
                <View
                    {...options}
                    isAuthenticated={isAuthenticated}
                    user={user}
                >
                    <Component {...props} />
                </View>
            );
        };
        WrappedComponent.displayName = `connectView(${Component.displayName ||
            Component.name})`;
        return WrappedComponent;
    };
