import { gql } from "@apollo/client";

const LAUNCHES_LIST = gql`
  query launchesList($limit: Int!, $offset: Int!, $find: LaunchFind!) {
    launches(limit: $limit, offset: $offset, find: $find) {
      mission_name
      details
      id
      launch_date_utc
      links {
        flickr_images
      }
    }
  }
`;

export default LAUNCHES_LIST;
