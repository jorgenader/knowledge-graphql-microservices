import React from 'react';
import { render } from 'react-dom';

import {
  Appear,
  Box,
  CodePane,
  CodeSpan,
  Deck,
  FlexBox,
  FullScreen,
  Link,
  Heading,
  Image,
  ListItem,
  Notes,
  OrderedList,
  Progress,
  Slide,
  Text,
  UnorderedList,
} from 'spectacle';

// SPECTACLE_CLI_THEME_START
const theme = {
  fonts: {
    header: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
    text: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
  },
  space: {
    headerMargin: '0',
  },
};
// SPECTACLE_CLI_THEME_END

// SPECTACLE_CLI_TEMPLATE_START
const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
  >
    <Box padding="0 1em">
      <FullScreen />
    </Box>
    <Box padding="1em">
      <Progress />
    </Box>
  </FlexBox>
);
// SPECTACLE_CLI_TEMPLATE_END

const graphQLLogo =
  'https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg';

const graphqlCodeBlockA = `
// Describe the data
type User {
  id: String
  name: String
}

type Project {
  name: String
  tagline: String
  contributors: [User]
}
`;

const graphqlCodeBlockB = `
// Query only the important parts
{
  project(name: "GraphQL") {
    tagline
    contributors {
      name
    }
  }
}

// Get what you asked for
{
  "project": {
    "tagline": "A query language for APIs",
    "contributors": [
      {
        "name": "Luke Skywalker"
      }
    ]
  }
}
`;

const federatedSchemaAccounts = `extend type Query {
  me: User
}

type User @key(fields: "id") {
  id: ID!
  username: String!
}`;

const federatedSchemaProducts = `extend type Query {
  topProducts(first: Int = 5): [Product]
}

type Product @key(fields: "upc") {
  upc: String!
  name: String!
  price: Int
}`;

const federatedSchemaReviews = `type Review {
  body: String
  author: User @provides(fields: "username")
  product: Product
}

extend type User @key(fields: "id") {
  id: ID! @external
  reviews: [Review]
}

extend type Product @key(fields: "upc") {
  upc: String! @external
  reviews: [Review]
}`;

const Presentation = () => (
  <Deck theme={theme} template={template}>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Image src={graphQLLogo} width={100} />
        <Heading fontSize="h3">GraphQL & Microservices</Heading>
        <Heading color="primary" fontSize="h4">
          Jorgen Ader
        </Heading>
        <Heading color="primary" fontSize="h6">
          04.02.2020
        </Heading>
      </FlexBox>
    </Slide>

    <Slide>
      <Heading fontSize="h2">THE PLAN</Heading>
      <OrderedList>
        <ListItem color="primary" fontSize="h3">
          GraphQL
        </ListItem>
        <ListItem color="primary" fontSize="h3">
          Microservice architecture
        </ListItem>
        <ListItem color="primary" fontSize="h3">
          Putting it together
        </ListItem>
        {/* If I fix it*/}
        {/*<ListItem color="primary" fontSize="h3">*/}
        {/*  Demo*/}
        {/*</ListItem>*/}
      </OrderedList>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="150px">GraphQL</Heading>
        <Heading fontSize="h3">A query language for your API</Heading>
        <Text fontSize={32}>Ask what you need</Text>
        <Text fontSize={32}>All the resources in single request</Text>
        <Text fontSize={32}>Strongly typed</Text>
        <Text fontSize={32}>Programming language agnostic</Text>
      </FlexBox>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Image src={graphQLLogo} width={100} />
        <Heading fontSize="h3">How does it work</Heading>
        <Text fontSize={32}>Schemas</Text>
        <Text fontSize={32}>Queries</Text>
        <Text fontSize={32}>Mutations</Text>
        <Text fontSize={32}>Resolvers</Text>
      </FlexBox>
    </Slide>

    <Slide>
      <Heading>Example Graph</Heading>
      <CodePane fontSize={18} language="graphql" autoFillHeight>
        {graphqlCodeBlockA}
      </CodePane>
    </Slide>

    <Slide>
      <Heading>Querying part of it</Heading>
      <CodePane fontSize={18} language="graphql" autoFillHeight>
        {graphqlCodeBlockB}
      </CodePane>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="150px">Microservices</Heading>
        <Heading fontSize="h3">Distributed systems</Heading>
        <Text fontSize={32}>Highly scalable</Text>
        <Text fontSize={32}>Loosely coupled</Text>
        <Text fontSize={32}>Single business concern</Text>
        <Text fontSize={32}>Owned by small team</Text>
      </FlexBox>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">Putting it together</Heading>
        <Text fontSize={36}>Schema stitching</Text>
        <Text fontSize={36}>Federation</Text>
      </FlexBox>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">Schema stitching</Heading>
        <Text fontSize={36}>Introspection</Text>
        <Text fontSize={36}>Manual type collisions resolving</Text>
        <Text fontSize={36}>Associate types to fields</Text>
        <Text fontSize={36}>Resolve data</Text>
      </FlexBox>
      <Notes>
        <p>https://graphcms.com/blog/graphql-schema-stitching/</p>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">Apollo Federation</Heading>
        <Text fontSize={36}>
          Declarative model of Graph composition of downstream GraphQL services
        </Text>
        <Text fontSize={36}>Loosely coupled</Text>
        <Text fontSize={36}>Resolve data from downstream services with query planner</Text>
        <Text fontSize={36}>Incremental adoption</Text>
      </FlexBox>
      <Notes>
        <p>
          https://www.apollographql.com/docs/apollo-server/federation/introduction/
        </p>
      </Notes>
    </Slide>

    <Slide>
      <Heading>Accounts service</Heading>
      <CodePane fontSize={18} language="graphql" autoFillHeight>
        {federatedSchemaAccounts}
      </CodePane>
    </Slide>

    <Slide>
      <Heading>Products service</Heading>
      <CodePane fontSize={18} language="graphql" autoFillHeight>
        {federatedSchemaProducts}
      </CodePane>
    </Slide>

    <Slide>
      <Heading>Reviews service</Heading>
      <CodePane fontSize={18} language="graphql" autoFillHeight>
        {federatedSchemaReviews}
      </CodePane>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">Thank you</Heading>
        <Heading fontSize="h2">Questions?</Heading>
      </FlexBox>
      <Notes>
        <p>
          https://www.apollographql.com/docs/apollo-server/federation/introduction/
        </p>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox flexDirection="column">
        <Heading fontSize="h3">References</Heading>
        <UnorderedList>
          <ListItem>
            <Link href="https://graphql.org/">https://graphql.org/</Link>
          </ListItem>
          <ListItem>
            <Link href="https://medium.com/@paigen11/what-is-graphql-really-76c48e720202">
              https://medium.com/@paigen11/what-is-graphql-really-76c48e720202
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://microservices.io/patterns/microservices.html">
              https://microservices.io/patterns/microservices.html
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://kelda.io/blog/the-dark-side-of-microservices/?utm_source=Lobste.rs&utm_medium=Blog&utm_campaign=Dark%20Side%20Blog">
              https://kelda.io/blog/the-dark-side-of-microservices/?utm_source=Lobste.rs&utm_medium=Blog&utm_campaign=Dark%20Side%20Blog
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://www.apollographql.com/">
              https://www.apollographql.com/
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://www.apollographql.com/docs/apollo-server/federation/federation-spec/">
              https://www.apollographql.com/docs/apollo-server/federation/federation-spec/
            </Link>
          </ListItem>
        </UnorderedList>
      </FlexBox>
    </Slide>
  </Deck>
);

render(<Presentation />, document.getElementById('root'));
