import { AlertTriangle, Loader, XIcon } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useGetMessageById } from "@/hooks";

type Props = {
  messageId: Id<"messages">;
  onClose: () => void;
};

export const Thread = ({ messageId, onClose }: Props) => {
  const { data: message, isLoading: isLoadingMessage } = useGetMessageById({ messageId });

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
    </div>
  )
};
