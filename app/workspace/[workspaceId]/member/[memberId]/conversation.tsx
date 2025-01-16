import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel"
import { useGetMemberById, useGetMessages, useMemberId } from "@/hooks";
import { ConversationHeader } from "./conversation-header";

type Props = {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: Props) => {
  const memberId = useMemberId();

  const {
    data: member,
    isLoading: memberLoading
  } = useGetMemberById({ memberId });

  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />
    </div>
  )
}
