import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.spacex.land/graphql",
  documents: "./src/**/*.graphql.ts",
  generates: {
    "./src/lib/apollo/SpaceX/queries/codegen/SpaceXGraphQL.query.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};
export default config;
