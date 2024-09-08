import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal
} from "lucide-react";

import {
  useCurrentMember,
  useGetChannels,
  useGetMembers,
  useGetWorkspace,
  useWorkspaceId,
} from "@/hooks";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";
import { useChannelStore } from "@/store";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: loadingMember } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: loadingWorkspace } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: loadingChannels } = useGetChannels({ workspaceId });
  const { data: members, isLoading: loadingMembers } = useGetMembers({ workspaceId });

  const { setCreateChannelModalOpen } = useChannelStore();

  if (loadingWorkspace || loadingMember) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">
          Workspace not found
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        isAdmin={member.role === 'admin'}
        workspace={workspace}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
        />
        <SidebarItem
          label="Drafts and sent"
          icon={SendHorizontal}
          id="drafts"
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === 'admin'
          ? () => setCreateChannelModalOpen(true)
          : undefined
        }
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct messages"
        hint="New message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
};
