import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:3001/' || 'https://react-graphql-todo-app.vercel.app/',
    cache: new InMemoryCache(),
})

export default client;
