import { contentfulConfig } from "./config";

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
};

const graphqlEndpoint = `https://graphql.contentful.com/content/v1/spaces/${contentfulConfig.spaceId}/environments/${contentfulConfig.environment}`;

export async function contentfulGraphQLRequest<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData> {
  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${contentfulConfig.accessToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as GraphQLResponse<TData>;

  if (!response.ok || payload.errors?.length) {
    throw new Error(
      [
        `Contentful GraphQL request failed: ${response.status} ${response.statusText}`,
        ...(payload.errors?.map((error) => error.message) ?? []),
      ].join("\n"),
    );
  }

  if (!payload.data) {
    throw new Error("Contentful GraphQL response does not contain data");
  }

  return payload.data;
}
