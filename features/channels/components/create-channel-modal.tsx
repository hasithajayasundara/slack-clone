'use client';

import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChannelStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useCreateChannel, useWorkspaceId } from "@/hooks";

export const CreateChannelModal = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const {
    isCreateChannelModalOpen,
    setCreateChannelModalOpen,
  } = useChannelStore();

  const { isPending, mutate } = useCreateChannel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCreateChannel = (value: FieldValues) => {
    mutate({
      id: workspaceId,
      name: value.name,
    }, {
      onSuccess: (id) => {
        toast.success('Channel created');
        reset();
        setCreateChannelModalOpen(false);
        router.push(`/workspace/${workspaceId}/channel/${id}`);
      },
      onError: () => {
        toast.error('Failed to create channel');
      }
    });
  };

  return (
    <Dialog
      open={isCreateChannelModalOpen}
      onOpenChange={setCreateChannelModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a channel
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleCreateChannel)}>
          <Input
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Channel name"
            error={errors.name?.message?.toString()}
            {...register('name', {
              required: 'Channel name is required',
              validate: (value) => (
                /^[a-zA-Z0-9-]*$/.test(value) || 'Name can only contain alpha numeric characters and "-"'
              )
            })}
          />
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
};
