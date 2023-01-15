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

type LaunchesListCardProps = {
  mission_name?: string | null;
  imageSrc?: string | null;
  launch_year?: string | null;
  launch_success?: boolean | null;
  details?: string | null;
  id?: string | null;
};

const LaunchesListCard = ({
  mission_name,
  imageSrc,
  launch_year,
  launch_success,
  details,
  id,
}: LaunchesListCardProps) => {
  return (
    <Card
      maxW="sm"
      width={{ sm: "100%", md: "22em", lg: "25em" }}
      maxWidth={{ sm: "100%", md: "22em", lg: "25em" }}
      boxShadow="lg"
    >
      <CardBody>
        <Image
          src={imageSrc as string}
          alt={mission_name || "Image from mission"}
          borderRadius="lg"
          width="100%"
          height="250px"
          objectFit="cover"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{mission_name}</Heading>
          <Text>{details || "No details provided."}</Text>
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
          <Link href={`/launch/${id}`}>
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
