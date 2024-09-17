import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { toast } from "sonner";

import {
  useChannelId,
  useCreateMessage,
  useWorkspaceId
} from "@/hooks";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type Props = {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: Props) => {
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
    try {
      setIsPending(true);
      await createMessage({
        workspaceId,
        channelId,
        body,
      }, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
