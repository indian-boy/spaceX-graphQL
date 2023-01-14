import {
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

type LaunchesListCardProps = {
  mission_name?: string | null;
  imageSrc?: string | null;
  launch_date_utc?: string | null;
  details?: string | null;
};

const LaunchesListCard = ({
  mission_name,
  imageSrc,
  launch_date_utc,
  details,
}: LaunchesListCardProps) => {
  return (
    <Card maxW="sm">
      <CardBody>
        <Image
          src={
            imageSrc ||
            "https://v5j9q4b5.rocketcdn.me/wp-content/uploads/2020/06/spacex-historia-pioneirismo-e-exploracao-sustentavel-11.jpg"
          }
          alt={mission_name || "Image from launch"}
          borderRadius="lg"
          width="100%"
          height="250px"
          objectFit="cover"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{mission_name}</Heading>
          <Text>{details || "No details provided."}</Text>
          <Text color="blue.600" fontSize="2xl">
            Launch date: {launch_date_utc}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="center">
        <ButtonGroup spacing="2">
          <Button variant="ghost" colorScheme="blue">
            Open details...
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default LaunchesListCard;
