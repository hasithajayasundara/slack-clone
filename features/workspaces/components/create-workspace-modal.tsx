'use client';

import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspace } from "@/hooks";
import { useWorkspaceStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateWorkspaceModal = () => {
  const router = useRouter();

  const { isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen } =
    useWorkspaceStore();
  const { register, handleSubmit, formState: { errors }, } = useForm();

  const { mutate, isPending, isSuccess } = useCreateWorkspace();

  const handleClose = () => {
    setCreateWorkspaceModalOpen(false);
  };

  const handleCreateWorkspace = ({ name }: FieldValues) => {
    mutate({ name }, {
      onSuccess(id) {
        toast.success('Workspace created');
        setCreateWorkspaceModalOpen(false);
        router.push(`/workspace/${id}`);
      }
    });
  };

  return (
    <Dialog open={isCreateWorkspaceModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleCreateWorkspace)}>
          <Input
            required
            placeholder="Workspace name"
            error={errors.name?.message?.toString()}
            {...register('name', { required: 'Workspace name is required' })}
          />
          <div className="flex justify-end">
            <Button
              disabled={isPending}
              type="submit"
            >
              Create new workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
