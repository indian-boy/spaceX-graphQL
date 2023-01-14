import { gql } from "@apollo/client";

const GET_LAUNCHES = gql`
  query launchesList($limit: Int!, $offset: Int!, $find: LaunchFind!) {
    launches(limit: $limit, offset: $offset, find: $find) {
      mission_name
      details
      id
      launch_date_utc
      links {
        flickr_images
        video_link
      }
    }
  }
`;

export default GET_LAUNCHES;
