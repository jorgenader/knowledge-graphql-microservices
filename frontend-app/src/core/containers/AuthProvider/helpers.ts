import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { TokenAuth, TokenAuthVariables } from './__generated__/TokenAuth';
import { Viewer } from './__generated__/Viewer';
import TokenAuthMutation from './TokenAuth.graphql';
import UserDetailsQuery from './UserDetails.graphql';

export { TokenAuth, TokenAuthVariables } from './__generated__/TokenAuth';

export function useTokenAuth() {
    const [loginHandler] = useMutation<TokenAuth, TokenAuthVariables>(
        TokenAuthMutation
    );

    return loginHandler;
}

export function useViewer(cb?: (data: Viewer) => void) {
    return useLazyQuery<Viewer>(UserDetailsQuery, {
        onCompleted: cb,
    });
}
