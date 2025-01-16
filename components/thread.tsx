import { AlertTriangle, Loader, XIcon } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Message } from "./message";
import {
  useCurrentMember,
  useGetMessageById,
  useWorkspaceId,
} from "@/hooks";
import { useState } from "react";

type Props = {
  messageId: Id<"messages">;
  onClose: () => void;
};

export const Thread = ({ messageId, onClose }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessageById({ messageId });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  if (isLoadingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] border-b px-4">
          <p className="text-lg font-bold">
            Thread
          </p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!message) {
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center h-[49px] border-b px-4">
        <p className="text-lg font-bold">
          Thread
        </p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Message not found
        </p>
      </div>
    </div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center h-[49px] border-b px-4">
        <p className="text-lg font-bold">
          Thread
        </p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div>
        {message && (
          <Message
            hideThreadButton
            memberId={message.memberId}
            authorImage={message.user.image}
            authorName={message.user.name}
            isAuthor={message.member._id === currentMember?._id}
            body={message.body}
            image={message.image}
            createdAt={message._creationTime}
            updatedAt={message.updatedAt}
            id={message._id}
            reactions={message.reactions}
            isEditing={editingId === message._id}
            setEditingId={setEditingId}
          />
        )}
      </div>
    </div>
  )
};
