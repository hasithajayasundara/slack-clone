import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfirm, useUpdateJoinCode, useWorkspaceId } from "@/hooks";

type Props = {
  name: string;
  joinCode: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const InviteModal = ({ open, name, joinCode, setOpen }: Props) => {
  const workspaceId = useWorkspaceId();

  const { updateJoinCode, isUpdatingJoinCode } = useUpdateJoinCode();
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    message: 'This will generate new invite code'
  });

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success('Link copied');
    });
  };

  const handleUpdateJoinCode = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }

    updateJoinCode(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success('Invite code regenerated');
        },
        onError: () => {
          toast.error('Failed to regenerate new code');
        }
      })
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite people to your {name}
            </DialogTitle>
            <DialogDescription>
              Use code below to invite people
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isUpdatingJoinCode}
              onClick={handleUpdateJoinCode}
              variant="outline"
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button
                disabled={isUpdatingJoinCode}
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
};
