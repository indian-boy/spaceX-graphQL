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
import { NextSeo } from "next-seo";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InView } from "react-intersection-observer";

import type { Launch } from "lib/apollo/spaceX/spaceXGraphQL.query";
import { useLaunchesListLazyQuery } from "lib/apollo/spaceX/spaceXGraphQL.query";
import { LaunchesListCard } from "lib/components/Launches/LaunchesListCard";

// merge launches and remove those with duplicated 'id', there is probably a problem with the back-end
const purifyLaunchesList = (newData: Launch[], previousValue: Launch[] = []) =>
  [...previousValue, ...(newData as Launch[])].reduce(
    (launches: Launch[], launch: Launch) =>
      launches.map((launchFromList) => launchFromList.id).includes(launch.id)
        ? launches
        : [...launches, launch],
    []
  );

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: { searchInput } });
  const [canLoadMoreLaunches, setCanLoadMoreLaunches] = useState(true);
  const [launchesList, setLaunchesList] = useState<Launch[]>([]);
  const [fetchLaunches, { data, loading, error, fetchMore }] =
    useLaunchesListLazyQuery();

  useEffect(() => {
    if (!data?.launches) {
      return;
    }

    setLaunchesList(data.launches as Launch[]);
  }, [data?.launches]);

  useEffect(() => {
    const firstLaunchesFetch = async () => {
      await fetchLaunches({
        variables: {
          offset: 0,
          limit: 10,
          find: { mission_name: "" },
        },
      });
    };

    const timeoutCallbackFetchLaunches = setTimeout(() => {
      firstLaunchesFetch().then(() => {
        setCanLoadMoreLaunches(true);
      });
    });

    return () => {
      clearTimeout(timeoutCallbackFetchLaunches);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    async (values: { searchInput: string }) => {
      setSearchInput(values.searchInput);
      setCanLoadMoreLaunches(true);

      await fetchLaunches({
        fetchPolicy: "network-only",
        variables: {
          offset: 0,
          limit: 10,
          find: { mission_name: values.searchInput },
        },
      });
    },
    [fetchLaunches]
  );

  return (
    <Flex direction="column" gap="2em">
      <NextSeo title="Search missions" />
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
        {launchesList.map((launch) => (
          <LaunchesListCard
            key={launch?.id}
            mission_name={launch?.mission_name}
            details={launch?.details}
            imageSrc={
              launch?.links?.flickr_images?.length
                ? launch?.links?.flickr_images[0]
                : "https://v5j9q4b5.rocketcdn.me/wp-content/uploads/2020/06/spacex-historia-pioneirismo-e-exploracao-sustentavel-11.jpg"
            }
            launch_year={launch?.launch_year}
            launch_success={launch?.launch_success}
            id={launch.id as string}
          />
        ))}
      </Flex>
      {launchesList.length === 0 && !canLoadMoreLaunches && (
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
          visibility={canLoadMoreLaunches ? "visible" : "hidden"}
          display="flex"
          alignSelf="center"
        />
        <InView
          onChange={async (inView) => {
            if (inView && canLoadMoreLaunches) {
              const { data: newData } = await fetchMore({
                variables: {
                  offset: launchesList.length,
                  limit: 10,
                  find: { mission_name: searchInput },
                },
              });

              const newDataLength = newData.launches?.length || 0;

              setLaunchesList((previous) =>
                purifyLaunchesList(newData.launches as Launch[], previous)
              );

              if (newDataLength < 10) {
                setCanLoadMoreLaunches(false);
              }
            }
          }}
        />
      </>
    </Flex>
  );
};

export default SearchPage;
