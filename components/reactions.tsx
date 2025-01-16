import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCurrentMember, useWorkspaceId } from "@/hooks";
import { cn } from "@/lib/utils";

type Props = {
  data: Array<Omit<Doc<"reactions">, "memberId"> & {
    count: number;
    memberIds: Id<"members">[];
  }>;
  onChange: (value: string) => void;
};

export const Reactions = ({ data, onChange }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMember) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((r) => (
        <button
          onClick={() => onChange(r.value)}
          key={r._id}
          className={cn(
            "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-80 flex items-center gap-x-1",
            currentMemberId && r.memberIds.includes(currentMemberId) && "bg-blue-100/70 border-blue-500 text-blue-500"
          )}>
          {r.value}
          <span className={cn(
            "text-xs font-semibold text-muted-foreground",
            currentMemberId && r.memberIds.includes(currentMemberId) && "text-blue-500"
          )}>
            {r.count}
          </span>
        </button>
      ))}
    </div>
  )
};
