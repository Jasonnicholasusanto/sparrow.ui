import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { TagSearchResult } from "@/schemas/tags";

export async function searchTagsClient(
  q: string,
  limit = 8,
): Promise<TagSearchResult[]> {
  return clientApiClient<TagSearchResult[]>(
    `${Endpoints.Tags.Base}${Endpoints.Tags.Search(q, limit)}`,
    {
      method: "GET",
      version: Endpoints.Tags.BaseVersion,
    },
  );
}
