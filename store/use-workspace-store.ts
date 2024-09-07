import { create } from 'zustand';

type WorkspaceStore = {
  isCreateWorkspaceModalOpen: boolean;
  setCreateWorkspaceModalOpen: (flag: boolean) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  isCreateWorkspaceModalOpen: false,
  setCreateWorkspaceModalOpen: (flag) => set(() => ({
    isCreateWorkspaceModalOpen: flag,
  })),
}));

