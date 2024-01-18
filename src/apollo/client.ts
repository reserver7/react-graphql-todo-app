import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.VERCEL_ENV === 'production'
        ? process.env.APOLLO_SERVER_URL
        : 'http://localhost:3001/',
    cache: new InMemoryCache(),
});

export default client;
