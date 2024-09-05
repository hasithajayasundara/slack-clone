'use client';

import {
  useGetWorkspace,
  useWorkspaceId,
} from "@/hooks";

type Props = {
  params: {
    workspaceId: string;
  }
};

const Workspace = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: workspaceId });

  return (
    <div>
      Workspace id
    </div>
  )
};

export default Workspace;
