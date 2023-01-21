"use client";

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
  Box,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InView } from "react-intersection-observer";

import type { Launch } from "lib/apollo/SpaceX/queries/codegen/SpaceXGraphQL.query";
import { useLaunchesListLazyQuery } from "lib/apollo/SpaceX/queries/codegen/SpaceXGraphQL.query";
import SpaceXLogo from "lib/components/icons/SpaceXLogo";
import { LaunchesListCard } from "lib/components/Launches/LaunchesListCard";
import { purifyListByKey } from "lib/helpers/purifyListByKey";

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
    <>
      <NextSeo title="SpaceX search missions" />
      <Box marginBottom="5" maxWidth="25em">
        <SpaceXLogo />
      </Box>
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
              zIndex="2"
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
              key={launch.id}
              mission_name={launch?.mission_name}
              details={launch.details}
              links={launch?.links}
              launch_year={launch?.launch_year}
              launch_success={launch?.launch_success}
              id={launch.id as string}
            />
          ))}
        </Flex>
        {!launchesList.length && !canLoadMoreLaunches && (
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
          {!error && (
            <Spinner
              visibility={canLoadMoreLaunches ? "visible" : "hidden"}
              display="flex"
              alignSelf="center"
            />
          )}
          <InView
            onChange={async (inView) => {
              if (inView && canLoadMoreLaunches) {
                const { data: newValues } = await fetchMore({
                  variables: {
                    offset: launchesList.length,
                    limit: 10,
                    find: { mission_name: searchInput },
                  },
                });

                setLaunchesList((oldValues) =>
                  purifyListByKey(
                    "id",
                    oldValues,
                    newValues.launches as Launch[]
                  )
                );

                const newDataLength = newValues.launches?.length || 0;
                if (newDataLength < 10) {
                  setCanLoadMoreLaunches(false);
                }
              }
            }}
          />
        </>
      </Flex>
    </>
  );
};

export default SearchPage;
