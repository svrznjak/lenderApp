import { GraphQLClient } from "graphql-request";
import { getAuth } from "firebase/auth";

const endpoint = "http://localhost:9000/graphql";
// const endpoint = "http://192.168.0.15:9000/graphql";
//const endpoint = "http://192.168.0.80:9000/graphql";
//const endpoint = "https://lender-app-api.herokuapp.com/graphql";
// const endpoint = "https://money-lender.app/graphql/";

export default async function requestBackend({
  gql,
  variables,
  headers,
}: {
  gql?: any;
  variables?: any;
  headers?: any;
}) {
  const auth: any = getAuth();
  const accessToken = auth.currentUser.accessToken || "";
  const client = new GraphQLClient(endpoint, {
    method: "POST",
    headers: {
      authorization: accessToken,
      ...headers,
    },
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
