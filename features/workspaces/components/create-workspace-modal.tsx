import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useWorkspaceStore } from "@/store";
import { DialogTitle } from "@radix-ui/react-dialog";

export const CreateWorkspaceModal = () => {
  const { isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen } =
    useWorkspaceStore();

  const handleClose = () => {
    setCreateWorkspaceModalOpen(false);
  };

  return (
    <Dialog open={isCreateWorkspaceModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
