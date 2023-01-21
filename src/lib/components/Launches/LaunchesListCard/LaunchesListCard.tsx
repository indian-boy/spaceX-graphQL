"use client";

import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

import type { Launch } from "lib/apollo/spaceX/spaceXGraphQL.query";

const LaunchesListCard = ({
  mission_name,
  launch_year,
  launch_success,
  details = "No details provided.",
  id,
  links,
}: Launch) => {
  return (
    <Card
      maxW="sm"
      width={{ sm: "100%", md: "22em", lg: "25em" }}
      maxWidth={{ sm: "100%", md: "22em", lg: "25em" }}
      boxShadow="lg"
    >
      <CardBody>
        <Image
          src={
            (links?.flickr_images as string[])[0] ||
            "https://v5j9q4b5.rocketcdn.me/wp-content/uploads/2020/06/spacex-historia-pioneirismo-e-exploracao-sustentavel-11.jpg"
          }
          alt={mission_name || "Image from mission"}
          borderRadius="lg"
          width="100%"
          height="250px"
          objectFit="cover"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{mission_name}</Heading>
          <Text>{details}</Text>
          <Text color="blue.600" fontSize="2xl">
            Launch year: {launch_year}
            {launch_success && (
              <Badge
                fontWeight="bold"
                variant="solid"
                marginLeft="1em"
                colorScheme="green"
              >
                Success
              </Badge>
            )}
            {!launch_success && (
              <Badge
                fontWeight="bold"
                variant="solid"
                marginLeft="1em"
                colorScheme="red"
              >
                Failed
              </Badge>
            )}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="center">
        <ButtonGroup spacing="2">
          <Link href={`/launch/${id}.html`}>
            <Button variant="ghost" colorScheme="blue">
              Open details...
            </Button>
          </Link>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default LaunchesListCard;
