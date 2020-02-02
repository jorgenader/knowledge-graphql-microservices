import dotEnv from 'dotenv';
import { GraphQLRequestContext } from 'apollo-server-types';
import { ApolloServer } from 'apollo-server';
import {
    ApolloGateway,
    ServiceEndpointDefinition,
    RemoteGraphQLDataSource,
} from '@apollo/gateway';
import express from "express";

// Load config values from env
dotEnv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const ACCOUNTS_SERVICE = process.env.ACCOUNTS_SERVICE_URL;
const PRODUCTS_SERVICE = process.env.PRODUCTS_SERVICE_URL;
const LISTS_SERVICE = process.env.LISTS_SERVICE_URL;

// TODO: Make session cookies work and drop JWT maybe
const responseHeadersToForward: Array<string> = [
    // Forward any cookies that the backends set.
    'set-cookie',
];

interface GraphQLProxyContext {
    token?: string;
    res?: express.Response;
}

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    async process<TContext>({ request, context }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>) {
        // `response` here is the response we got back from the backend.
        const response = await super.process({
            request,
            context,
        });

        const contextData: GraphQLProxyContext = (context as any) as GraphQLProxyContext;

        if (response.http && contextData.res) {
            const { http } = response;
            const { res } = contextData;

            responseHeadersToForward.forEach(name => {
                const value = http.headers.get(name);
                if (value != null) {
                    // `res` is the response we are sending to the client.
                    res.set(name, value);
                }
            });
        }

        return response;
    }

    willSendRequest<TContext>({
        request,
        context,
    }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>) {
        const contextData: GraphQLProxyContext = (context as any) as GraphQLProxyContext;

        if (request.http) {
            for (let [key, value] of request.http.headers) {
                console.log(`HEADERS: ${key} = ${value}`);
            }
        }

        if (request.http && contextData.token) {
            request.http.headers.set('Authorization', contextData.token);
        }
    }
}

const gateway = new ApolloGateway({
    debug: true,

    serviceList: [
        { name: 'accounts', url: `${ACCOUNTS_SERVICE}/graphql` },
        { name: 'products', url: `${PRODUCTS_SERVICE}/graphql` },
        { name: 'lists', url: `${LISTS_SERVICE}/graphql` },
    ],

    buildService({ url }: ServiceEndpointDefinition) {
        return new AuthenticatedDataSource({ url });
    },
});

const server = new ApolloServer({
    subscriptions: false,

    gateway,

    context: ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization || '';

        // add the user to the context
        return { token, res: req.res };
    },
});

// The `listen` method launches a web server.
server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
