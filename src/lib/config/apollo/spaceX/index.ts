import { ApolloClient, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        books: offsetLimitPagination(),
      },
    },
  },
});

const client = new ApolloClient({
  uri: "https://api.spacex.land/graphql",
  cache,
});

export default client;
