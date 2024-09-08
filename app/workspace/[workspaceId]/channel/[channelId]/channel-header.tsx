import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FieldValues, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  useChannelId,
  useConfirm,
  useCurrentMember,
  useRemoveChannel,
  useUpdateChannel,
  useWorkspaceId,
} from "@/hooks";

type Props = {
  title: string;
};

export const ChannelHeader = ({ title }: Props) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    message: 'This action is irreversible'
  });

  const { data: member } = useCurrentMember({ workspaceId });
  const { updateChannel, isUpdatingChannel } = useUpdateChannel();
  const { removeChannel, isRemovingChannel } = useRemoveChannel();

  const { register, reset, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      name: title,
    }
  });

  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

  const handleChannelUpdate = (values: FieldValues) => {
    updateChannel({ name: values.name, id: channelId }, {
      onSuccess: () => {
        toast.success('Channel updated');
        setEditOpen(false);
        reset();
      },
      onError: () => {
        toast.error('Failed to update channel');
      }
    })
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }

    removeChannel({ id: channelId }, {
      onSuccess: () => {
        toast.success('Channel removed');
        router.replace(`/workspace/${workspaceId}`);
      },
      onError: () => {
        toast.error('Failed to remove channel');
      }
    });
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
            >
              <span className="truncate">
                # {title}
              </span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidde">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle>
                # {title}
              </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog
                open={editOpen}
                onOpenChange={isAdmin ? setEditOpen : undefined}
              >
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        Channel name
                      </p>
                      {isAdmin && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Rename channel
                    </DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmit(handleChannelUpdate)}>
                    <Input
                      required
                      autoFocus
                      disabled={isUpdatingChannel}
                      error={errors.name?.message?.toString()}
                      minLength={3}
                      maxLength={80}
                      placeholder="New channel name"
                      {...register('name', {
                        required: 'Channel name is required',
                        validate: (value) => (
                          /^[a-zA-Z0-9-]*$/.test(value) || 'Name can only contain alpha numeric characters and "-"'
                        )
                      })}
                    />
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          disabled={isUpdatingChannel || isRemovingChannel}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        disabled={isUpdatingChannel || isRemovingChannel}
                        type="submit"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {isAdmin && (
                <button
                  disabled={isUpdatingChannel || isRemovingChannel}
                  onClick={handleDelete}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
