import React, { ComponentType, FC } from 'react';

import { View, ViewProps } from '@frontend-core/containers/View';
import { useAuth } from '@frontend-core/hooks';

export type ViewDecoratorOptions = Pick<
    ViewProps,
    'className' | 'onUserUpdate'
>;

export const withView = (options: Partial<ViewDecoratorOptions> = {}) =>
    function decorator<P>(Component: ComponentType<P>) {
        const WrappedComponent: FC<P> = props => {
            const { user } = useAuth();
            return (
                <View {...options} isAuthenticated={!!user} user={user}>
                    <Component {...props} />
                </View>
            );
        };
        WrappedComponent.displayName = `connectView(${Component.displayName ||
            Component.name})`;
        return WrappedComponent;
    };
