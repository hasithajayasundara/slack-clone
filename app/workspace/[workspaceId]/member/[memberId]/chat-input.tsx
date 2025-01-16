import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";
import {
  useChannelId,
  useCreateMessage,
  useGenerateUploadUrl,
  useWorkspaceId
} from "@/hooks";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type Props = {
  placeholder: string;
  conversationId: Id<"conversations">;
}

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const ChatInput = ({
  placeholder,
  conversationId
}: Props) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUrl({}, { throwError: true });
        if (!url) {
          throw new Error('url no found');
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,

        });

        if (!result.ok) {
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
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
