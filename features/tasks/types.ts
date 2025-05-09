export type Priority = 1 | 2 | 3 | 4;
export type TodoistTask = {
  id: string;
  creator_id: string;
  created_at: string; // ISO
  assignee_id: string | null;
  assigner_id: string | null;
  comment_count: number;
  is_completed: boolean;
  content: string;
  description: string;
  due: {
    date: string; // "2016-09-01",
    is_recurring: boolean;
    datetime?: string; // "2016-09-01T12:00:00.000000Z",
    string?: string; // "tomorrow at 12",
    timezone?: string;
  } | null;
  deadline: {
    date: string; // "2016-09-04"
    lang: string;
  } | null;
  // NOTE: Whilst duration exists in the Todoist API, it is not used in the app
  // Instead we use estimatedDuration in the TaskExtra table
  // duration: {
  //   amount: number;
  //   unit: "minute" | "day"; // "minute"
  // } | null;
  labels: string[]; // ["Food", "Shopping"],
  order: number;
  priority: Priority;
  project_id: string;
  section_id: string | null;
  parent_id: string | null;
  url: string; // "https://todoist.com/showTask?id=2995104339"
};

export type Task = {
  id: string;
  createdAt: string;
  isCompleted: boolean;
  content: string;
  description: string;
  dueDate?: string; //YYYY-MM-dd
  dueIsRecurring: boolean;
  dueString?: string;
  dueTimezone?: string;
  deadlineDate?: string;
  deadlineLang?: string;
  // durationAmount?: number;
  // durationUnit?: "minute" | "day";
  order: number;
  priority: Priority;
  projectId?: string;
  sectionId?: string;
  parentId?: string;
  url?: string;
  assigneeId?: string;
  assignerId?: string;
  commentCount: number;
};

export type TaskExtra = {
  estimatedDuration: number; // in minutes
  anxietyLevel: number;
  difficulty: number;
  skip?: boolean;
};

export type CompletedTask = Task &
  Session &
  SubSession & {
    lastCompletedAt: string;
    estimatedDuration?: number;
    durationInSeconds?: number;
  };

export type TaskExtraUpdate = Partial<TaskExtra>;

export type TaskUpdate = Partial<Omit<Task, "id" | "createdAt">>;

export type Session = {
  taskId: string;
  estimatedDuration: number; // in minutes
  notes?: string;
  // start: string;
  // end?: string;
  // taskCompleted?: boolean;
};

export type SubSession = {
  sessionId: string;
  distractionCount: number;
  start: string;
  end?: string;
  taskCompleted?: boolean;
};
