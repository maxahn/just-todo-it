import { Task } from "../types";
import { create } from "zustand";

type ActiveMissionState = {
  activeMission: Task | null;
  setActiveMission: (mission: Task) => void;
  clearActiveMission: () => void;
};

export const useActiveMission = create<ActiveMissionState>((set) => ({
  activeMission: null,
  setActiveMission: (mission: Task) => set({ activeMission: mission }),
  clearActiveMission: () => set({ activeMission: null }),
}));
