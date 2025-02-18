import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";
import {
  useChannelId,
  useCreateMessage,
  useCurrentMember,
  useGenerateUploadUrl,
  useGetMessageById,
  useGetMessages,
  useWorkspaceId,
} from "@/hooks";
import { Message } from "./message";
import { Button } from "./ui/button";

type Props = {
  messageId: Id<"messages">;
  onClose: () => void;
};

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "EEEE, MMMM d");
};

const TIME_THRESHOLD = 5;

export const Thread = ({ messageId, onClose }: Props) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessageById({ messageId });
  const { results, status, loadMore } = useGetMessages({ channelId, parentMessageId: messageId });

  const isLoadingMore = status === 'LoadingMore';
  const canLoadMore = status === 'CanLoadMore';

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUrl } = useGenerateUploadUrl();

  const groupedMessages = results?.reduce((groups, message) => {
    const date = new Date(message._creationTime);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].unshift(message);
    return groups;
  }, {} as Record<string, typeof results>);

  const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        channelId,
        workspaceId,
        image: undefined,
        parentMessageId: messageId,
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

  if (isLoadingMessage || status === 'LoadingFirstPage') {
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
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-grey-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-grey-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {
              messages.map((message, idx) => {
                const prevMessage = messages[idx - 1];
                const isCompact = prevMessage
                  && prevMessage.user._id === message.user._id
                  && differenceInMinutes(
                    new Date(message._creationTime),
                    new Date(prevMessage._creationTime),
                  ) < TIME_THRESHOLD;
                return (
                  <Message
                    hideThreadButton={true}
                    key={message._id}
                    id={message._id}
                    memberId={message.memberId}
                    authorImage={message.user.image}
                    authorName={message.user.name}
                    isAuthor={currentMember?._id === message.memberId}
                    reactions={message.reactions}
                    body={message.body}
                    image={message.image}
                    updatedAt={message.updatedAt}
                    createdAt={message._creationTime}
                    isEditing={editingId === message._id}
                    setEditingId={setEditingId}
                    isCompact={isCompact}
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadTimestamp={message.threadTimestamp}
                    threadName={message.threadName}
                  />
                )
              })
            }
          </div>
        ))}
        <div
          className="h-1"
          ref={el => {
            if (el) {
              const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              }, { threshold: 1.0 });

              observer.observe(el);
              return () => observer.disconnect()
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-grey-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-grey-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
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
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};
