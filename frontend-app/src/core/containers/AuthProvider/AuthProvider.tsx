import { useApolloClient } from '@apollo/react-hooks';
import React, {
    createContext,
    Dispatch,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
} from 'react';

import { User } from '@frontend-app/utils/types';
import { getLocalStorage } from '@frontend-app/utils/Window';

import { useTokenAuth, useViewer, TokenAuthVariables } from './helpers';

interface AuthenticationState {
    user: User | null;
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

            storage.setItem('user', JSON.stringify(user));

            return {
                user,
            };
        case 'logout':
            storage.removeItem('user');

            return {
                user: null,
            };
        case 'error':
            const { errorCode, error } = action;
            return {
                user: null,
                errorCode,
                error,
            };
        default:
            return state;
    }
};

// TODO: Update this when Apollo has been added
export const AuthProvider: FC = ({ children }) => {
    const client = useApolloClient();
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
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

    const logout = useCallback(async () => {
        storage.removeItem('token');
        await client.resetStore();
        dispatch({ type: 'logout' });
    }, []);

    useEffect(() => {
        const token = storage.getItem('token');
        if (token) {
            getViewer();
        }
    }, []);

    const contextValue = useMemo<AuthContextValue>(() => {
        return {
            user: state.user,
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
