
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useConfirm,
  useRemoveWorkspace,
  useUpdateWorkspace,
  useWorkspaceId
} from "@/hooks";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
};

export const PreferencesModal = (props: Props) => {
  const router = useRouter();
  const { open, initialValue, setOpen } = props;
  const [editOpen, setEditOpen] = useState(false);

  const { register, reset, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialValue,
    }
  });

  const workspaceId = useWorkspaceId();
  const { updateWorkspace, isUpdatingWorkspace } = useUpdateWorkspace();
  const { removeWorkspace, isRemovingWorkspace } = useRemoveWorkspace();
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    message: 'This action is irreversible',
  });

  const handleRenameWorkspace = (values: FieldValues) => {
    updateWorkspace({
      id: workspaceId,
      name: values.name
    }, {
      onSuccess: () => {
        toast.success('Workspace updated');
        setEditOpen(false);
        reset();
      },
      onError: () => {
        toast.error('Failed to update workspace');
      }
    });
  };

  const handleRemoveWorkspace = async () => {
    const isConfirmed = await confirm();
    if (!isConfirmed) {
      return;
    }

    removeWorkspace({ id: workspaceId }, {
      onSuccess: () => {
        toast.success('Workspace removed');
        router.replace('/');
      },
      onError: () => {
        toast.error('Failed to remove workspace');
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>
              {initialValue}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Workspace name
                    </p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">
                    {initialValue}
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit(handleRenameWorkspace)}>
                  <Input
                    required
                    autoFocus
                    disabled={isUpdatingWorkspace}
                    error={errors.name?.message?.toString()}
                    placeholder="New workspace name"
                    minLength={3}
                    maxLength={80}
                    {...register('name', { required: 'Name should not be empty' })}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemoveWorkspace}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p
                className="text-sm font-semibold"
              >
                Delete workspace
              </p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  )
};
