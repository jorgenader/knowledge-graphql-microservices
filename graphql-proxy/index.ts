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

const USERS_SERVICE = process.env.USERS_SERVICE_URL;
const ROOMS_SERVICE = process.env.ROOMS_SERVICE_URL;
const MESSAGES_SERVICE = process.env.MESSAGES_SERVICE_URL;

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
            { name: 'users', url: USERS_SERVICE },
            { name: 'rooms', url: ROOMS_SERVICE },
            { name: 'messages', url: MESSAGES_SERVICE },
        ],

        buildService({ url }: ServiceEndpointDefinition) {
            return new AuthenticatedDataSource({ url });
        },
    }),
});

// The `listen` method launches a web server.
server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
