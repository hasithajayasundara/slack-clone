import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspace } from "@/hooks";
import { useWorkspaceStore } from "@/store";

export const CreateWorkspaceModal = () => {
  const { isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen } =
    useWorkspaceStore();

  const { mutate } = useCreateWorkspace();

  const handleClose = () => {
    setCreateWorkspaceModalOpen(false);
  };

  const handleSubmit = () => {
    mutate({
      name: "Workspace 1",
    },{
      onSuccess(){

      }, 
      onError(){
        
      }
    });
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
