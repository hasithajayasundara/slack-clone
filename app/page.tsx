"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/hooks";
import { useWorkspaceStore } from "@/store";

const Home = () => {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const { isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen } =
    useWorkspaceStore();
  const workspaceId = useMemo(() => data?.at(0)?._id, [data]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isCreateWorkspaceModalOpen) {
      setCreateWorkspaceModalOpen(true);
    }
  }, [
    router,
    isLoading,
    workspaceId,
    isCreateWorkspaceModalOpen,
    setCreateWorkspaceModalOpen,
  ]);

  return (
    <div>
      <UserButton />
    </div>
  );
}

export default Home;
