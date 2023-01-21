import { ApolloClient, InMemoryCache } from "@apollo/client";

// const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         launches: offsetLimitPagination(),
//       },
//     },
//   },
// });

const apolloClient = new ApolloClient({
  uri: "https://api.spacex.land/graphql",
  cache: new InMemoryCache({}),
});

export default apolloClient;
