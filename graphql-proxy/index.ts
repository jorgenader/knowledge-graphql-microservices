import dotEnv from 'dotenv';
import { GraphQLRequestContext } from 'apollo-server-types';
import { ApolloServer } from 'apollo-server';
import {
    ApolloGateway,
    ServiceEndpointDefinition,
    RemoteGraphQLDataSource,
} from '@apollo/gateway';

// Load config values from env
dotEnv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const ACCOUNTS_SERVICE = process.env.ACCOUNTS_SERVICE_URL;
const PRODUCTS_SERVICE = process.env.PRODUCTS_SERVICE_URL;
const LISTS_SERVICE = process.env.LISTS_SERVICE_URL;

interface GraphQLProxyContext {
    userId?: string;
}

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest<TContext>({
        request,
        context,
    }: Pick<
        GraphQLRequestContext<TContext>,
        'request' | 'context'
    >) {
        const contextData: GraphQLProxyContext = (context as any) as GraphQLProxyContext;

        if (request.http && contextData.userId) {
            request.http.headers.set('x-user-id', contextData.userId);
        }
    }
}

const server = new ApolloServer({
    subscriptions: false,

    gateway: new ApolloGateway({
        serviceList: [
            { name: 'accounts', url: `${ACCOUNTS_SERVICE}/graphql` },
            { name: 'products', url: `${PRODUCTS_SERVICE}/graphql` },
            { name: 'lists', url: `${LISTS_SERVICE}/graphql` },
        ],

        // buildService({ url }: ServiceEndpointDefinition) {
        //     return new AuthenticatedDataSource({ url });
        // },
    }),
});

// The `listen` method launches a web server.
server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
