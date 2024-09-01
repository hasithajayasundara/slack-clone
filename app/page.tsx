"use client";

import { useEffect, useMemo } from "react";

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/hooks";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.at(0)?._id, [data]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (workspaceId) {
      console.log("Redeirec if");
    } else {
      console.log("open modal");
    }
  }, [isLoading, workspaceId]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
