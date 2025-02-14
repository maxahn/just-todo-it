import { Task } from "../types";
import { create } from "zustand";

type ActiveMissionState = {
  activeMission: Task | null;
  setActiveMission: (mission: Task | null) => void;
  clearActiveMission: () => void;
};

export const useActiveMission = create<ActiveMissionState>((set) => ({
  activeMission: null,
  setActiveMission: (mission) => set({ activeMission: mission }),
  clearActiveMission: () => set({ activeMission: null }),
}));
