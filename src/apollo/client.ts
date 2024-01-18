import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: import.meta.env.VERCEL_ENV === 'production'
        ? import.meta.env.APOLLO_SERVER_URL
        : 'http://localhost:3001/',
    cache: new InMemoryCache(),
});

export default client;
