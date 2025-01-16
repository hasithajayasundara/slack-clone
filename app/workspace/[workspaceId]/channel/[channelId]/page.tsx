'use client';

import { Loader, TriangleAlert } from "lucide-react";

import { MessageList } from "@/components/message-list";
import {
  useChannelId,
  useGetChannel,
  useGetMessages
} from "@/hooks";
import { ChannelHeader } from "./channel-header";
import { ChatInput } from "./chat-input";

const Channel = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (channelLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="test-sm text-muted-foreground">
          Channel not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  )
};

export default Channel;
