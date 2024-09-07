import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useCurrentMember = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
  console.log(workspaceId);
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
