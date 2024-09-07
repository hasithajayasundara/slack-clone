import {
  useCurrentMember,
  useGetWorkspace,
  useWorkspaceId,
} from "@/hooks";
import { Loader } from "lucide-react";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  console.log(workspaceId);
  const { data: member, isLoading: loadingMember } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: loadingWorkspace } = useGetWorkspace({ id: workspaceId });

  if (loadingWorkspace || loadingMember) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div>Workspace</div>
  )
};
