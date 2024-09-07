import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

type Params = {
  workspaceId: Id<"workspaces">;
};

export const useGetChannels = ({ workspaceId }: Params) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
