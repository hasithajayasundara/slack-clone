'use client';

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import {
  useCurrentMember,
  useGetChannels,
  useGetWorkspace,
  useWorkspaceId,
} from "@/hooks";
import { useChannelStore } from "@/store";

const Workspace = () => {
  const workspaceId = useWorkspaceId();
  const {
    isCreateChannelModalOpen,
    setCreateChannelModalOpen
  } = useChannelStore();

  const router = useRouter();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

  useEffect(() => {
    if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) {
      return;
    }

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!isCreateChannelModalOpen && isAdmin) {
      setCreateChannelModalOpen(true);
    }
  }, [
    router,
    member,
    isAdmin,
    channelId,
    workspace,
    workspaceId,
    memberLoading,
    channelsLoading,
    workspaceLoading,
    isCreateChannelModalOpen,
    setCreateChannelModalOpen
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        No channel found
      </span>
    </div>
  );
};

export default Workspace;
