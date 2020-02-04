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

export const createApolloClient = (
    initialStore?: any,
    token: string | null = null
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

    const middlewareLink = new ApolloLink((operation, forward) => {
        if (token) {
            operation.setContext({
                headers: {
                    Authorization: `JWT ${token}`,
                },
            });
        }
        return forward(operation);
    });

    // TODO: Figure out how to set token correctly after login
    const httpLink = createHttpLink({
        uri: `${SETTINGS.BACKEND_SITE_URL}${SETTINGS.API_BASE}`,
        credentials: 'include',
    });

    const links = ApolloLink.from([middlewareLink, errorLink, httpLink]);

    return new ApolloClient({
        ssrMode: true,
        link: links,
        cache,
    });
};
