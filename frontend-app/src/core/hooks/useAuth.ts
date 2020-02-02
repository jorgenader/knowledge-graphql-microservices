import { useContext, useMemo } from 'react';

import {
    AuthContext,
    AuthContextValue,
} from '@frontend-core/containers/AuthProvider';

export type UseAuth = Omit<AuthContextValue, 'dispatch'>;

export const useAuth = (): UseAuth => {
    const { user, login, logout } = useContext(AuthContext);

    return useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user, login, logout]
    );
};
