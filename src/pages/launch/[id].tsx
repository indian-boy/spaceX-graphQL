import type { ApolloQueryResult } from "@apollo/client";
import type { GetStaticPaths, GetStaticProps } from "next";

import {
  LaunchesListDocument,
  GetLaunchDocument,
} from "lib/apollo/spaceX/spaceXGraphQL.query";
import type {
  GetLaunchQuery,
  Launch,
  LaunchesListQuery,
} from "lib/apollo/spaceX/spaceXGraphQL.query";
import apolloClient from "lib/config/apollo/spaceX";

type LaunchDetailPageProps = {
  data: Launch;
};

function LaunchDetailPage({ data }: LaunchDetailPageProps) {
  if (!data) {
    return <p>{`Couldn't render page`}</p>;
  }

  return <p>Launch: {data.mission_name}</p>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = (await apolloClient.query({
    query: LaunchesListDocument,
    variables: {
      limit: 10,
    },
  })) as ApolloQueryResult<LaunchesListQuery>;

  const params = (data.launches as Launch[]).map((launch) => ({
    params: { id: launch.id as string },
  }));

  return {
    paths: params,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };

  const { data } = (await apolloClient.query({
    query: GetLaunchDocument,
    variables: {
      id,
    },
  })) as ApolloQueryResult<GetLaunchQuery>;

  return {
    props: {
      data: data.launch,
    },
  };
};

export default LaunchDetailPage;
