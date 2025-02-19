import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { parseISO } from "date-fns/parseISO";

type Session = [string, string | null]; // start and end timestamp, if null, not ended
interface ActiveMissionState {
  activeMission: Task | null;
  setActiveMission: (mission: Task | null) => void;
  getIsActive: () => boolean;
  sessions: Session[];
  toggleIsTaskPaused: () => void;
  getTotalSessionsDuration: () => number;
  removeSession: (index: number) => void;
}

function getIsActive(sessions: Session[]) {
  const lastSession = sessions[sessions.length - 1];
  return lastSession && lastSession[1] === null;
}

function sumSessionsDurationMS(sessions: Session[]): number {
  return sessions.reduce((acc, [start, end]) => {
    const workingEnd = end || new Date().toISOString();
    const msDuration =
      parseISO(workingEnd).getTime() - parseISO(start).getTime();
    console.log({ msDuration });
    return acc + msDuration;
  }, 0);
}

export const useActiveMission = create(
  persist<ActiveMissionState>(
    (set, get) => ({
      activeMission: null,
      sessions: [],
      getIsActive: () => {
        const sessions = get().sessions;
        return getIsActive(sessions);
      },
      getTotalSessionsDuration: () => {
        const sessions = get().sessions;
        return Math.floor(sumSessionsDurationMS(sessions) / 1000);
      },
      removeSession: (index) => {
        set((state) => {
          const sessions = state.sessions;
          if (index < 0 || index >= sessions.length) {
            throw new Error("Invalid session index");
          }
          const newSessions = [
            ...sessions.slice(0, index),
            ...sessions.slice(index + 1),
          ];
          return {
            ...state,
            sessions: newSessions,
          };
        });
      },
      setActiveMission: (mission) =>
        set((state) => ({ ...state, activeMission: mission })),
      toggleIsTaskPaused: () => {
        set((state) => {
          const { sessions } = state;
          const isActive = getIsActive(sessions);
          if (isActive) {
            // Pause task
            if (!sessions?.length) {
              throw new Error("Task has no sessions to pause");
            }
            const lastSession = sessions[sessions.length - 1];
            if (lastSession[1]) {
              throw new Error("Task is already paused");
            }
            lastSession[1] = new Date().toISOString();
            const newSessions = [...sessions.slice(0, -1), lastSession];
            return {
              ...state,
              sessions: newSessions,
            };
          }
          // Start task
          return {
            ...state,
            sessions: [...state.sessions, [new Date().toISOString(), null]],
          };
        });
      },
    }),
    {
      name: "active-task",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
