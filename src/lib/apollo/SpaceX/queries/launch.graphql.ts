import { gql } from "@apollo/client";

const GET_LAUNCH = gql`
  query getLaunch($id: ID!) {
    launch(id: $id) {
      id
      details
      launch_success
      launch_site {
        site_name
      }
      launch_date_local
      links {
        flickr_images
        article_link
        mission_patch
        mission_patch_small
        presskit
        reddit_campaign
        reddit_media
        reddit_launch
        reddit_recovery
        video_link
        wikipedia
      }
      mission_name
      rocket {
        fairings {
          recovered
          recovery_attempt
          reused
          ship
        }
        first_stage {
          cores {
            flight
          }
        }
        rocket {
          company
          description
          country
          cost_per_launch
          boosters
          active
          diameter {
            feet
            meters
          }
          first_flight
          height {
            meters
            feet
          }
          id
          landing_legs {
            number
            material
          }
          mass {
            kg
            lb
          }
          name
          payload_weights {
            id
            kg
            name
            lb
          }
          second_stage {
            burn_time_sec
            engines
            fuel_amount_tons
            payloads {
              composite_fairing {
                height {
                  feet
                  meters
                }
                diameter {
                  feet
                  meters
                }
              }
            }
            thrust {
              kN
              lbf
            }
          }
          stages
          type
          wikipedia
        }
        rocket_name
        rocket_type
      }
      ships {
        abs
        active
        attempted_landings
        class
        course_deg
        home_port
        id
        image
        imo
        missions {
          flight
          name
        }
        mmsi
        model
        name
        position {
          latitude
          longitude
        }
        roles
        speed_kn
        status
        successful_landings
        type
        url
        weight_kg
        weight_lbs
        year_built
      }
      is_tentative
    }
  }
`;

export default GET_LAUNCH;
