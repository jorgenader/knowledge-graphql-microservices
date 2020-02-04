import dotEnv from 'dotenv';
import { GraphQLRequestContext } from 'apollo-server-types';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import {
    ApolloGateway,
    ServiceEndpointDefinition,
    RemoteGraphQLDataSource,
} from '@apollo/gateway';
import CookieParser from 'cookie-parser';

// Load config values from env
dotEnv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const ACCOUNTS_SERVICE = process.env.ACCOUNTS_SERVICE_URL;
const PRODUCTS_SERVICE = process.env.PRODUCTS_SERVICE_URL;
const LISTS_SERVICE = process.env.LISTS_SERVICE_URL;

const responseHeadersToForward: Array<string> = ['vary', 'set-cookie'];

interface GraphQLProxyContext {
    tokenHeader?: string;
    res?: express.Response;
}

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    async process<TContext>({
        request,
        context,
    }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>) {
        // `response` here is the response we got back from the backend.
        const response = await super.process({
            request,
            context,
        });

        const contextData: GraphQLProxyContext = (context as any) as GraphQLProxyContext;

        if (response.http && contextData.res) {
            const { http } = response;
            const { res } = contextData;

            // TODO: Add cookie-parser and see if it works
            //  Otherwise switch to koa or apollo-server-express

            // Parse raw header to forward it to correct service
            // `set-cookie` header is mangled otherwise
            const headers: { [key: string]: string[] | undefined } = (http.headers as any).raw();

            responseHeadersToForward.forEach(name => {
                const value = headers[name];

                if (!value) {
                    return;
                }

                // `res` is the response we are sending to the client.
                res.setHeader(name, value);

                console.log(`<- HEADERS: ${name} = ${value}`);
            });
        }

        return response;
    }

    willSendRequest<TContext>({
        request,
        context,
    }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>) {
        const contextData: GraphQLProxyContext = (context as any) as GraphQLProxyContext;

        console.log("tokenHeader", contextData.tokenHeader);

        if (request.http && contextData.tokenHeader) {
            request.http.headers.set('Authorization', contextData.tokenHeader);
        }
    }
}

const gateway = new ApolloGateway({
    // debug: true,

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

    context: ({ req, res }) => {
        console.log('Cookies: ', req.cookies);

        // get the user token from the headers
        let tokenHeader = req.headers.authorization || '';

        if (!tokenHeader && req.cookies['JWT']) {
            tokenHeader = `JWT ${req.cookies['JWT']}`;
        }

        console.log(tokenHeader);

        // add the user to the context
        return { tokenHeader, res };
    },
});

const app = express();
app.use(CookieParser());
server.applyMiddleware({
    app,
    bodyParserConfig: { limit: '50mb' },
    cors: {
        // TODO: Add better check
        origin: true,
        credentials: true,
    },
});

// The `listen` method launches a web server.
app.listen(PORT, () => {
    console.log(`🚀  Server ready at http://localhost:${PORT}/graphql`);
});
