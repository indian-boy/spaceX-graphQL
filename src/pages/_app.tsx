/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from "@apollo/client";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";

import defaultSEOConfig from "../../next-seo.config";
import apolloClient from "lib/apollo/config";
import { Chakra } from "lib/components/Chakra";
import Layout from "lib/layout";

import "lib/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Chakra>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <DefaultSeo {...defaultSEOConfig} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Chakra>
    </ApolloProvider>
  );
};

export default App;
