import { createMergeableStore } from "tinybase/mergeable-store";

export const SESSION_TABLE_ID = "sessions";
export const DISTRACTION_TABLE_ID = "distractions";
export const TASK_TABLE_ID = "tasks";

export const store = createMergeableStore(SESSION_TABLE_ID);

store.setValuesSchema({
  activeTaskId: { type: "string", default: "" },
});

store.setTablesSchema({
  [TASK_TABLE_ID]: {
    id: { type: "string" },
    createdAt: { type: "string" },
    isCompleted: { type: "boolean" },
    content: { type: "string" },
    description: { type: "string" },
    dueDate: { type: "string" }, //YYYY-MM-dd
    dueIsRecurring: { type: "boolean" },
    dueString: { type: "string" },
    dueTimezone: { type: "string" },
    deadlineDate: { type: "string" },
    durationAmount: { type: "number" },
    durationUnit: { type: "string" },
    order: { type: "number" },
    priority: { type: "number" },
    projectId: { type: "string" },
    sectionId: { type: "string" },
    url: { type: "string" },
    // custom non-TODOist fields
    estimatedDuration: { type: "number", default: 25 }, // in minutes
    anxietyLevel: { type: "number" },
    difficulty: { type: "number" },
  },
  [SESSION_TABLE_ID]: {
    id: { type: "string" },
    taskId: { type: "string" },
    start: { type: "string" },
    end: { type: "string" },
    distractionCount: { type: "number", default: 0 },
  },
  [DISTRACTION_TABLE_ID]: {
    id: { type: "string" },
    sessionId: { type: "string" },
    timestamp: { type: "string" },
  },
});
