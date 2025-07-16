import { create } from "zustand";
import { setIntroStatus } from "../services/db.service";

interface IntroState {
  hasSeenIntro: boolean | null;
  setHasSeenIntro: (seen: boolean) => void;
  markIntroAsSeen: () => Promise<void>;
}

export const useIntroStore = create<IntroState>((set) => ({
  hasSeenIntro: null,
  setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
  markIntroAsSeen: async () => {
    set({ hasSeenIntro: true });
    await setIntroStatus();
  },
}));
