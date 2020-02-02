import {
    defaultDataIdFromObject,
    IdGetterObj,
    InMemoryCache,
} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createHttpLink } from 'apollo-link-http';

import { SETTINGS } from '@frontend-app/settings';
import { getLocalStorage } from '@frontend-app/utils/Window';

export const createApolloClient = (
    initialStore?: any,
    initialToken: string | null = null
) => {
    let cache = new InMemoryCache({
        dataIdFromObject: (result: { nodeId?: string } & IdGetterObj) => {
            const dataId = defaultDataIdFromObject(result);
            if (dataId !== null) {
                return dataId;
            }
            if (
                result.nodeId !== undefined &&
                result.__typename !== undefined
            ) {
                return `${result.__typename}:${result.nodeId}`;
            }
            return null;
        },
    });

    if (initialStore) {
        cache = cache.restore(initialStore);
    }

    const middlewareLink = new ApolloLink((operation, forward) => {
        const token = getLocalStorage().getItem('token');
        if (token || initialToken) {
            operation.setContext({
                headers: {
                    Authorization: `JWT ${token || initialToken}`,
                },
            });
        }
        return forward(operation);
    });

    // TODO: Better error parser
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                )
            );
        }
        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
        }
    });

    // TODO: Figure out how to set token correctly after login
    const httpLink = createHttpLink({
        uri: `${SETTINGS.BACKEND_SITE_URL}${SETTINGS.API_BASE}`,
        credentials: 'same-origin',
    });

    const links = ApolloLink.from([errorLink, middlewareLink, httpLink]);

    return new ApolloClient({
        ssrMode: true,
        link: links,
        cache,
    });
};
