import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { query } from "@/convex/_generated/server";
import { v } from "convex/values";

export const useCurrentMember = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useGetMembers = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useMemberId = () => {
  const params = useParams();
  return params.memberId as Id<"members">;
};

export const useGetMemberById = ({ memberId }: { memberId: Id<"members"> }) => {
  const data = useQuery(api.members.getGetMemberById, { id: memberId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

