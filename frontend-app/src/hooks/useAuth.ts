import { useContext, useMemo } from 'react';

import {
    AuthContext,
    AuthContextValue,
} from '@frontend-app/containers/AuthProvider';

export type UseAuth = Omit<AuthContextValue, 'dispatch'>;

export const useAuth = (): UseAuth => {
    const { user, expiresAt, login, logout } = useContext(AuthContext);

    return useMemo(
        () => ({
            user,
            expiresAt,
            login,
            logout,
        }),
        [user, expiresAt, login, logout]
    );
};
