import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { parseISO } from "date-fns/parseISO";
import { Session } from "../types";
import { createContext, ProviderProps, useContext } from "react";
import { TasksContext } from "../contexts/TasksContext";

// interface ActiveMissionState {
//   activeMission: Task | null;
//   // taskIdPriorityList: string[];
//   // setDistractionCounter: (distractionCounter: number) => void;
//   setActiveMission: (mission: Task | null) => void;
//   clearSessions: () => void;
//   getIsActive: () => boolean;
//   sessions: Session[];
//   toggleIsTaskPaused: () => void;
//   getTotalSessionsDuration: () => number;
//   removeSession: (index: number) => void;
// }

function getIsActive(sessions: Session[]) {
  const lastSession = sessions[sessions.length - 1];
  return lastSession && lastSession[1] === null;
}

// export const ActiveMissionContext = createContext<ActiveMissionState>({
//   activeMission: null,
//   setActiveMission: () => {},
//   clearSessions: () => {},
//   getIsActive: () => false,
//   sessions: [],
//   toggleIsTaskPaused: () => {},
//   getTotalSessionsDuration: () => 0,
//   removeSession: () => {},
// });

export const useActiveMission = () => {
  const context = useContext(TasksContext);
  if (!context)
    throw new Error(
      "useActiveMission hook must be called within the ActiveTaskProvider",
    );
  return context;
};

// export const useActiveMission = create(
//   persist<ActiveMissionState>(
//     (set, get) => ({
//       activeMission: null,
//       sessions: [],
//       distractionCounter: 0,
//       taskIdPriorityList: [],
//       setDistractionCounter: (distractionCounter) => {
//         set((state) => ({ ...state, distractionCounter }));
//       },
//       getIsActive: () => {
//         const sessions = get().sessions;
//         return getIsActive(sessions);
//       },
//       getTotalSessionsDuration: () => {
//         const sessions = get().sessions;
//         return Math.floor(sumSessionsDurationMS(sessions) / 1000);
//       },
//       clearSessions: () => set((state) => ({ ...state, sessions: [] })),
//       removeSession: (index) => {
//         set((state) => {
//           const sessions = state.sessions;
//           if (index < 0 || index >= sessions.length) {
//             throw new Error("Invalid session index");
//           }
//           const newSessions = [
//             ...sessions.slice(0, index),
//             ...sessions.slice(index + 1),
//           ];
//           return {
//             ...state,
//             sessions: newSessions,
//           };
//         });
//       },
//       setActiveMission: (mission) =>
//         set((state) => ({ ...state, activeMission: mission })),
//       toggleIsTaskPaused: () => {
//         set((state) => {
//           const { sessions } = state;
//           const isActive = getIsActive(sessions);
//           if (isActive) {
//             // Pause task
//             if (!sessions?.length) {
//               throw new Error("Task has no sessions to pause");
//             }
//             const lastSession = sessions[sessions.length - 1];
//             if (lastSession[1]) {
//               throw new Error("Task is already paused");
//             }
//             lastSession[1] = new Date().toISOString();
//             const newSessions = [...sessions.slice(0, -1), lastSession];
//             return {
//               ...state,
//               sessions: newSessions,
//             };
//           }
//           // Start task
//           return {
//             ...state,
//             sessions: [...state.sessions, [new Date().toISOString(), null]],
//           };
//         });
//       },
//     }),
//     {
//       name: "active-task",
//       storage: createJSONStorage(() => AsyncStorage),
//     },
//   ),
// );
