"use client";

import { useEffect, useMemo } from "react";

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/hooks";
import { useWorkspaceStore } from "@/store";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const { isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen } =
    useWorkspaceStore();
  const workspaceId = useMemo(() => data?.at(0)?._id, [data]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (workspaceId) {
      console.log("Redeirec if");
    } else if (!isCreateWorkspaceModalOpen) {
      setCreateWorkspaceModalOpen(true);
    }
  }, [
    isCreateWorkspaceModalOpen,
    isLoading,
    setCreateWorkspaceModalOpen,
    workspaceId,
  ]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
