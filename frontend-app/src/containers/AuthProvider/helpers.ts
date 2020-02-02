import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import {
    RefreshToken,
    RefreshTokenVariables,
} from './__generated__/RefreshToken';
import { TokenAuth, TokenAuthVariables } from './__generated__/TokenAuth';
import { VerifyToken, VerifyTokenVariables } from './__generated__/VerifyToken';
import { Viewer } from './__generated__/Viewer';
import TokenRefreshMutation from './TokenRefresh.graphql';
import TokenAuthMutation from './TokenAuth.graphql';
import TokenVerifyMutation from './TokenVerify.graphql';
import UserDetailsQuery from './UserDetails.graphql';

export {
    RefreshToken,
    RefreshTokenVariables,
} from './__generated__/RefreshToken';
export { TokenAuth, TokenAuthVariables } from './__generated__/TokenAuth';
export { VerifyToken, VerifyTokenVariables } from './__generated__/VerifyToken';

export function useTokenAuth() {
    const [loginHandler] = useMutation<TokenAuth, TokenAuthVariables>(
        TokenAuthMutation
    );

    return loginHandler;
}

export function useRefreshToken() {
    const [tokenRefreshHandler] = useMutation<
        RefreshToken,
        RefreshTokenVariables
    >(TokenRefreshMutation);

    return tokenRefreshHandler;
}

export function useTokenVerify() {
    const [verifyToken] = useMutation<VerifyToken, VerifyTokenVariables>(
        TokenVerifyMutation
    );

    return verifyToken;
}

export function useViewer(cb?: (data: Viewer) => void) {
    return useLazyQuery<Viewer>(UserDetailsQuery, {
        onCompleted: cb,
    });
}
