export type Priority = 1 | 2 | 3 | 4;
export type Task = {
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
  } | null;
  duration: {
    amount: number;
    unit: "minute" | "day"; // "minute"
  } | null;
  labels: string[]; // ["Food", "Shopping"],
  order: number;
  priority: Priority;
  project_id: string;
  section_id: string | null;
  parent_id: string | null;
  url: string; // "https://todoist.com/showTask?id=2995104339"
};

export type TaskUpdate = {
  content?: string;
  description?: string;
  labels?: string[];
  priority?: Priority;
  due_date?: string;
  due_datetime?: string;
  due_string?: string;
  due_lang?: string;
  assignee_id?: string;
  duration?: number;
  duration_unit?: "minute" | "day";
  deadline_date?: string;
  deadline_lang?: string; // 2-letter code specifying language
};
