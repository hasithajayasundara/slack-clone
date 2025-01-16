'use client';

import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import {
  useCreateOrGetConversation,
  useMemberId,
  useWorkspaceId
} from "@/hooks";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateOrGetConversation();

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  useEffect(() => {
    mutate({ workspaceId, memberId }, {
      onSuccess(data) {
        setConversationId(data);
      },
      onError() {
        toast.error('Failed to get conversation');
      }
    });
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Conversation not found
        </p>
      </div>
    );
  }

  return (
    <Conversation id={conversationId} />
  );
}

export default MemberIdPage;

