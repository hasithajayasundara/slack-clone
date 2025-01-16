"use client";

import { useEffect, useState } from "react";
import {
  CreateChannelModal,
  CreateWorkspaceModal,
} from "@/features";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};
