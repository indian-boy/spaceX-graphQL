import { useLaunchesListQuery } from "lib/apollo/spaceX/spaceXGraphQL.query";

function SearchPage() {
  const { data, loading, error } = useLaunchesListQuery({
    variables: {
      limit: 10,
      offset: 0,
      find: {},
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  // eslint-disable-next-line no-console
  console.log("data", data);
  return <div>Hello search page</div>;
  //   return data.locations.map(({ id, name, description, photo }) => (
  //     <div key={id}>
  //       <h3>{name}</h3>
  //       <img width="400" height="250" alt="location-reference" src={`${photo}`} />
  //       <br />
  //       <b>About this location:</b>
  //       <p>{description}</p>
  //       <br />
  //     </div>
  //   ));
}

export default SearchPage;