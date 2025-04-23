import { createMergeableStore } from "tinybase/mergeable-store";

export const SESSION_TABLE_ID = "sessions";
export const SUB_SESSION_TABLE_ID = "sub_sessions";
export const DISTRACTION_TABLE_ID = "distractions";
export const TASK_TABLE_ID = "tasks";
export const TASK_EXTRA_TABLE_ID = "tasks_extra";
export const COMPLETED_TASK_TABLE_ID = "completed_tasks";

export const store = createMergeableStore(SESSION_TABLE_ID);

store.setValuesSchema({
  activeTaskId: { type: "string", default: "" },
  activeSessionId: { type: "string", default: "" }, // !!!!
  activeSubSessionId: { type: "string", default: "" }, // !!!!
});

store.setTablesSchema({
  [TASK_TABLE_ID]: {
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
  },
  [COMPLETED_TASK_TABLE_ID]: {
    createdAt: { type: "string" },
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
    // Above same as TASK_TABLE
    lastCompletedAt: { type: "string" }, // because tasks can be reoccuring, this will store last completed
    estimatedDuration: { type: "number" },
  },
  [TASK_EXTRA_TABLE_ID]: {
    taskId: { type: "string" },
    estimatedDuration: { type: "number", default: 25 }, // in minutes
    anxietyLevel: { type: "number" },
    difficulty: { type: "number" },
    skip: { type: "boolean", default: false },
  },
  [SESSION_TABLE_ID]: {
    taskId: { type: "string" },
    estimatedDuration: { type: "number", default: 25 }, // in minutes
    notes: { type: "string" },
    // start: { type: "string" },
    // end: { type: "string" },
    // distractionCount: { type: "number", default: 0 },
  },
  [SUB_SESSION_TABLE_ID]: {
    sessionId: { type: "string" },
    start: { type: "string" },
    end: { type: "string" },
    distractionCount: { type: "number", default: 0 },
    taskCompleted: { type: "boolean", default: false },
  },
  [DISTRACTION_TABLE_ID]: {
    sessionId: { type: "string" },
    timestamp: { type: "string" },
  },
});
