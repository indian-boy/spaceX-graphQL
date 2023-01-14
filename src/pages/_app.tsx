/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from "@apollo/client";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";

import defaultSEOConfig from "../../next-seo.config";
import { Chakra } from "lib/components/Chakra";
import client from "lib/config/apollo/spaceX";
import Layout from "lib/layout";

import "lib/styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
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

export default MyApp;
