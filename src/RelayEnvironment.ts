import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
if (GRAPHQL_ENDPOINT === undefined) {
  throw new Error("GRAPHQL_ENDPOINT environment variable is missing");
}

const fetchFn: FetchFunction = async (request, variables) => {
  const resp = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Accept:
        "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
      "Content-Type": "application/json",
      // <-- Additional headers like 'Authorization' would go here
    },
    body: JSON.stringify({
      query: request.text, // <-- The GraphQL document composed by Relay
      variables,
    }),
    cache: "no-store",
  });

  return await resp.json();
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

let relayEnvironment: Environment | undefined;

export function initRelayEnvironment() {
  const environment = relayEnvironment ?? createRelayEnvironment();

  // For SSG and SSR always create a new Relay environment.
  if (typeof window === "undefined") {
    return environment;
  }

  // Create the Relay environment once in the client
  // and then reuse it.
  if (!relayEnvironment) {
    relayEnvironment = environment;
  }

  return relayEnvironment;
}
