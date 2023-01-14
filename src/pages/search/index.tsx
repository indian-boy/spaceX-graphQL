import { SearchIcon } from "@chakra-ui/icons";
import {
  Spinner,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { useLaunchesListQuery } from "lib/apollo/spaceX/spaceXGraphQL.query";
import { LaunchesListCard } from "lib/components/Launches/LaunchesListCard";

function SearchPage() {
  const [searchInput, setSearchInput] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { searchInput } });

  const { data, loading, error } = useLaunchesListQuery({
    variables: {
      limit: 10,
      offset: 0,
      find: { mission_name: searchInput },
    },
  });

  const onSubmit = useCallback((values: { searchInput: string }) => {
    setSearchInput(values.searchInput);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Flex direction="column" gap="2rem">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.searchInput}>
          <FormLabel htmlFor="searchInput">Search missions</FormLabel>
          <Input
            id="searchInput"
            placeholder="Search Thaicom, CRS-1, CASSIOPE..."
            {...register("searchInput", {
              minLength: { value: 4, message: "Minimum length should be 3" },
            })}
          />
          <IconButton
            size="sm"
            cursor="pointer"
            position="absolute"
            right="0.4rem"
            top="2.2rem"
            zIndex={2}
            background="transparent"
            type="submit"
            aria-label="Search database"
            icon={!isSubmitting ? <SearchIcon /> : <Spinner />}
          />
          <FormErrorMessage>
            {errors.searchInput && errors.searchInput.message}
          </FormErrorMessage>
        </FormControl>
      </form>
      <Flex wrap="wrap" gap="1rem" justifyContent="center">
        {data?.launches?.map((launch) => (
          <LaunchesListCard
            key={launch?.id}
            mission_name={launch?.mission_name}
            details={launch?.details}
            imageSrc={
              launch?.links?.flickr_images?.length
                ? launch?.links?.flickr_images[0]
                : ""
            }
            launch_date_utc={new Date(
              launch?.launch_date_utc
            ).toLocaleDateString()}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default SearchPage;
