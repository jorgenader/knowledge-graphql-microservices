import { useApolloClient } from '@apollo/react-hooks';
import React, {
    createContext,
    Dispatch,
    FC,
    useCallback,
    useMemo,
    useReducer,
} from 'react';

import { SETTINGS } from '@frontend-app/settings';
import { User } from '@frontend-app/utils/types';
import { getLocalStorage } from '@frontend-app/utils/Window';

import {
    useRefreshToken,
    useTokenAuth,
    useTokenVerify,
    useViewer,
    TokenAuthVariables,
} from './helpers';

interface AuthenticationState {
    user: User | null;
    expiresAt: number | null;
    errorCode?: string;
    error?: Error;
}

interface LoginAction {
    type: 'login';
    user: User;
}

interface LogoutAction {
    type: 'logout';
}

interface LoginErrorAction {
    type: 'error';
    errorCode: string;
    error: Error;
}

type Actions = LoginAction | LogoutAction | LoginErrorAction;

export interface AuthContextValue {
    user: User | null;
    expiresAt: number | null;
    dispatch: Dispatch<Actions>;
    login: (variables: TokenAuthVariables) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>(null as any);

const storage = getLocalStorage();

const authReducer = (
    state: AuthenticationState,
    action: Actions
): AuthenticationState => {
    switch (action.type) {
        case 'login':
            const { user } = action;
            // Token lifetime is in minutes
            const expiresAt =
                SETTINGS.AUTH_TOKEN_LIFETIME * 60000 + new Date().getTime();

            storage.setItem('expires_at', JSON.stringify(expiresAt));
            storage.setItem('user', JSON.stringify(user));

            return {
                user,
                expiresAt,
            };
        case 'logout':
            storage.removeItem('expires_at');
            storage.removeItem('user');

            return {
                user: null,
                expiresAt: null,
            };
        case 'error':
            const { errorCode, error } = action;
            return {
                user: null,
                expiresAt: null,
                errorCode,
                error,
            };
        default:
            return state;
    }
};

// TODO: Update this when Apollo has been added
// TODO: Check token exp and calculate from token
export const AuthProvider: FC = ({ children }) => {
    const client = useApolloClient();
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        expiresAt: null,
    });
    const [getViewer] = useViewer(user => {
        if (user.viewer) {
            dispatch({ type: 'login', user: user.viewer });
        }
    });

    const onTokenAuth = useTokenAuth();
    const login = useCallback(
        async (variables: TokenAuthVariables) => {
            const result = await onTokenAuth({
                variables,
            });

            if (
                result.data &&
                result.data.tokenAuth &&
                result.data.tokenAuth.token
            ) {
                storage.setItem('token', result.data.tokenAuth.token);
                getViewer();
            }
        },
        [onTokenAuth]
    );

    // TODO: Automatic token refresh

    const logout = useCallback(async () => {
        storage.removeItem('token');
        await client.resetStore();
    }, []);

    const contextValue = useMemo<AuthContextValue>(() => {
        return {
            user: state.user,
            expiresAt: state.expiresAt,
            dispatch,
            login,
            logout,
        };
    }, [state, dispatch]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
