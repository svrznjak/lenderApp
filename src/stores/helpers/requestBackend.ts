import { GraphQLClient } from "graphql-request";

const endpoint = "http://192.168.0.15:9000/graphql";

export default async function requestBackend({
  gql,
  variables,
  headers,
}: {
  gql?: any;
  variables?: any;
  headers?: any;
}) {
  const client = new GraphQLClient(endpoint, {
    headers,
    jsonSerializer: {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
  });
  try {
    return await client.request(gql, variables);
  } catch (err: any) {
    console.log(err.response.errors[0].message);
    throw new Error(err.response.errors[0].message);
  }
}
