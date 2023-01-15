import { SearchIcon } from "@chakra-ui/icons";
import {
  Spinner,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InView } from "react-intersection-observer";

import type { Launch } from "lib/apollo/spaceX/spaceXGraphQL.query";
import { useLaunchesListQuery } from "lib/apollo/spaceX/spaceXGraphQL.query";
import { LaunchesListCard } from "lib/components/Launches/LaunchesListCard";

const purifyLaunchesList = (newData: Launch[], previousValue: Launch[]) =>
  [...previousValue, ...(newData as Launch[])].reduce(
    (launches: Launch[], launch: Launch) =>
      launches.map((launchFromList) => launchFromList.id).includes(launch.id)
        ? launches
        : [...launches, launch],
    []
  );

function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const [launchesList, setLaunchesList] = useState<Launch[]>([]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: { searchInput } });
  const [hasMoreLaunches, setHasMoreLaunches] = useState(true);
  const { data, loading, error, fetchMore } = useLaunchesListQuery({
    variables: {
      limit: 10,
      offset: 0,
      find: { mission_name: searchInput },
    },
  });

  useEffect(() => {
    if (!data?.launches) {
      return;
    }

    if (data?.launches?.length < 10) {
      setHasMoreLaunches(false);
    }

    setLaunchesList((previousValue) =>
      purifyLaunchesList(data.launches as Launch[], previousValue)
    );
  }, [data?.launches]);

  const onSubmit = useCallback((values: { searchInput: string }) => {
    setHasMoreLaunches(true);
    setLaunchesList([]);
    setSearchInput(values.searchInput);
  }, []);

  return (
    <Flex direction="column" gap="2em">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.searchInput}>
          <FormLabel fontSize="lg" htmlFor="searchInput">
            Search missions
          </FormLabel>
          <Input
            id="searchInput"
            placeholder="Search Thaicom, CRS-1..."
            {...register("searchInput", {
              minLength: { value: 3, message: "Minimum length should be 3" },
            })}
          />
          <IconButton
            size="sm"
            cursor="pointer"
            position="absolute"
            right="0.5em"
            top="2.8em"
            zIndex={2}
            background="transparent"
            type="submit"
            aria-label="Search launches"
            icon={!loading ? <SearchIcon /> : <Spinner />}
          />
          <FormErrorMessage>
            {errors.searchInput && errors.searchInput.message}
          </FormErrorMessage>
        </FormControl>
      </form>
      <Flex wrap="wrap" gap="1em">
        {launchesList.length > 0 &&
          launchesList.map((launch) => (
            <LaunchesListCard
              key={launch?.id}
              mission_name={launch?.mission_name}
              details={launch?.details}
              imageSrc={
                launch?.links?.flickr_images?.length
                  ? launch?.links?.flickr_images[0]
                  : ""
              }
              launch_year={launch?.launch_year}
              launch_success={launch?.launch_success}
            />
          ))}
      </Flex>
      {launchesList.length === 0 && !hasMoreLaunches && (
        <Text display="flex" alignSelf="center">
          No results found.
        </Text>
      )}
      {error && (
        <Text display="flex" alignSelf="center">
          Error : {error.message}
        </Text>
      )}
      <>
        <Spinner
          visibility={hasMoreLaunches ? "visible" : "hidden"}
          display="flex"
          alignSelf="center"
        />
        <InView
          onChange={async (inView) => {
            const currentLength = launchesList.length || 0;
            if (inView && hasMoreLaunches) {
              await fetchMore({
                variables: {
                  offset: currentLength * 2,
                  limit: 10,
                  find: { mission_name: searchInput },
                },
              }).then(({ data: newData }) => {
                if (!newData?.launches) {
                  return;
                }

                if (newData?.launches?.length < 10) {
                  setHasMoreLaunches(false);
                }

                if (newData?.launches?.length > 0) {
                  setLaunchesList((previousValue) =>
                    purifyLaunchesList(
                      newData.launches as Launch[],
                      previousValue
                    )
                  );
                }
              });
            }
          }}
        />
      </>
    </Flex>
  );
}

export default SearchPage;
