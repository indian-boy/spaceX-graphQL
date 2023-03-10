import type { ApolloQueryResult } from "@apollo/client";
import {
  ArrowBackIcon,
  ExternalLinkIcon,
  ArrowDownIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Image,
  Grid,
  GridItem,
  Text,
  Link,
  Spinner,
  Container,
} from "@chakra-ui/react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";

import apolloClient from "lib/apollo/config";
import {
  LaunchesListDocument,
  GetLaunchDocument,
} from "lib/apollo/SpaceX/queries/codegen/SpaceXGraphQL.query";
import type {
  GetLaunchQuery,
  Launch,
  LaunchesListQuery,
} from "lib/apollo/SpaceX/queries/codegen/SpaceXGraphQL.query";

type LaunchDetailPageProps = {
  launch: Launch;
};

function LaunchDetailPage({ launch }: LaunchDetailPageProps) {
  if (!launch) {
    return (
      <Container height="100%" width="100%">
        <Spinner
          transform="translate(50%, 50%)"
          position="absolute"
          top="50%"
          right="50%"
        />
      </Container>
    );
  }

  return (
    <>
      <NextSeo title={launch.mission_name as string} />
      <Link href="/" color="black" aria-label="Navigate back to search">
        <ArrowBackIcon fontSize="3xl" />
      </Link>
      <Grid
        templateAreas={{
          sm: `"header header"
      "links image"
      "links footer"`,
          base: `"header header"
      "image image"
      "footer footer"
      "links links"`,
        }}
        gridTemplateRows={{ base: "1fr 20em", sm: "1fr 40em" }}
        gridTemplateColumns="12em 1fr"
        h="100%"
        maxWidth="70em"
        gap="4"
        color="blackAlpha.700"
        margin="0 auto"
        marginTop={4}
      >
        <GridItem
          justifyContent="space-between"
          display="flex"
          alignItems="center"
          area="header"
          flexDirection={{ base: "column", sm: "row" }}
        >
          <Text fontSize="3xl" textAlign="center">
            Mission: {launch.mission_name}
            {launch.launch_success && (
              <Badge
                marginLeft="1em"
                fontWeight="bold"
                variant="solid"
                colorScheme="green"
              >
                Success
              </Badge>
            )}
            {!launch.launch_success && (
              <Badge
                marginLeft="1em"
                fontWeight="bold"
                variant="solid"
                colorScheme="red"
              >
                Failed
              </Badge>
            )}
          </Text>
          <Text>
            Launch date:{" "}
            {new Date(launch.launch_date_local).toLocaleDateString()}
          </Text>
        </GridItem>
        <GridItem
          bg="black"
          area="links"
          boxShadow="lg"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          gap="1em"
          flexDirection="column"
          padding="1em"
        >
          <Text color="white" display="flex" alignItems="center" gap="2">
            <ArrowDownIcon /> More below
          </Text>
          {launch.links?.article_link && (
            <Link
              href={launch.links?.article_link as string}
              isExternal
              color="white"
              display="flex"
              alignItems="center"
              gap="1em"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon />
              Article
            </Link>
          )}
          {launch.links?.presskit && (
            <Link
              href={launch.links?.presskit as string}
              isExternal
              color="white"
              display="flex"
              alignItems="center"
              gap="1em"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon /> Presskit
            </Link>
          )}

          {launch.links?.reddit_launch && (
            <Link
              href={launch.links?.reddit_launch as string}
              isExternal
              color="white"
              display="flex"
              alignItems="center"
              gap="1em"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon /> Reddit
            </Link>
          )}
          {launch.links?.wikipedia && (
            <Link
              href={launch.links?.wikipedia as string}
              isExternal
              color="white"
              display="flex"
              alignItems="center"
              gap="1em"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon /> Wikipedia
            </Link>
          )}
        </GridItem>
        <GridItem area="image" borderRadius="lg">
          <Image
            src={
              (launch.links?.flickr_images as string[])[0] ||
              "https://v5j9q4b5.rocketcdn.me/wp-content/uploads/2020/06/spacex-historia-pioneirismo-e-exploracao-sustentavel-11.jpg"
            }
            alt={launch.mission_name || "Image from mission"}
            width="100%"
            height="100%"
            objectFit="cover"
            borderRadius="lg"
          />
        </GridItem>
        <GridItem area="footer">
          <Text color="black">
            {launch.details ? launch.details : "No details provided."}
          </Text>
        </GridItem>
      </Grid>
    </>
  );
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

  if (!data.launch) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      launch: data.launch,
    },
    revalidate: 3600,
  };
};

export default LaunchDetailPage;
