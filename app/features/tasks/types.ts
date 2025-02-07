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
  priority: number; // 1 | 2 | 3?
  project_id: string;
  section_id: string | null;
  parent_id: string | null;
  url: string; // "https://todoist.com/showTask?id=2995104339"
};
