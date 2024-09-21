'use client';

import { Loader, TriangleAlert } from "lucide-react";

import {
  useChannelId,
  useGetChannel,
  useGetMessages
} from "@/hooks";
import { ChannelHeader } from "./channel-header";
import { ChatInput } from "./chat-input";

const Channel = () => {
  const channelId = useChannelId();
  const { results } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });


  console.log(results);

  if (channelLoading) {
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
      <div className="flex-1" />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  )
};

export default Channel;
