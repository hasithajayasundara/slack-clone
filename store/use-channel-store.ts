import { create } from 'zustand';

type ChannelStore = {
  isCreateChannelModalOpen: boolean;
  setCreateChannelModalOpen: (flag: boolean) => void
}

export const useChannelStore = create<ChannelStore>((set) => ({
  isCreateChannelModalOpen: false,
  setCreateChannelModalOpen: (flag) => set(() => ({
    isCreateChannelModalOpen: flag,
  })),
}));

