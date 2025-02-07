import { sortByDueDateAndPriority } from "../app/features/tasks/utils/sortTasks";
import {
  DUE_TODAY,
  DUE_TOMORROW,
  NO_DUE_DATE,
  NO_DUE_DATE_2,
  NO_DUE_DATE_3,
  PAST_DUE_DATE,
} from "./TEST_TASKS";

test("order task due today over tomorrow", () => {
  const tasks = [DUE_TOMORROW, DUE_TODAY];
  const sortedTasks = sortByDueDateAndPriority(tasks);
  expect(sortedTasks[0].content).toBe(DUE_TODAY.content);
  expect(sortedTasks[1].content).toBe(DUE_TOMORROW.content);
  expect(sortedTasks.length).toBe(tasks.length);
});

test("order task due today over tomorrow and no due date", () => {
  const tasks = [DUE_TOMORROW, NO_DUE_DATE, DUE_TODAY];
  const sortedTasks = sortByDueDateAndPriority(tasks);
  expect(sortedTasks[0].content).toBe(DUE_TODAY.content);
  expect(sortedTasks[1].content).toBe(DUE_TOMORROW.content);
  expect(sortedTasks[2].content).toBe(NO_DUE_DATE.content);
  expect(sortedTasks.length).toBe(3);
});

test("order tasks with due dates over task with no due date", () => {
  const tasks = [
    NO_DUE_DATE,
    DUE_TOMORROW,
    NO_DUE_DATE_2,
    DUE_TODAY,
    NO_DUE_DATE_3,
  ];
  const sortedTasks = sortByDueDateAndPriority(tasks);
  expect(sortedTasks[0].content).toBe(DUE_TODAY.content);
  expect(sortedTasks[1].content).toBe(DUE_TOMORROW.content);
  expect(sortedTasks.length).toBe(tasks.length);
});

test("order tasks with no due date but higher priority", () => {
  const P1 = { ...NO_DUE_DATE, priority: 4 };
  const P2 = { ...NO_DUE_DATE_3, priority: 3 };
  const P3 = { ...NO_DUE_DATE_2, priority: 2 };
  const P4 = { ...NO_DUE_DATE, priority: 1 };
  const tasks = [P2, P4, P3, P1];
  const sortedTasks = sortByDueDateAndPriority(tasks);
  expect(sortedTasks[0].content).toBe(P1.content);
  expect(sortedTasks[1].content).toBe(P2.content);
  expect(sortedTasks[2].content).toBe(P3.content);
  expect(sortedTasks[3].content).toBe(P4.content);
  expect(sortedTasks.length).toBe(tasks.length);
});

test("order tasks with same due date but higher priority", () => {
  const P1 = { ...DUE_TOMORROW, priority: 4 };
  const P2 = { ...DUE_TOMORROW, priority: 3 };
  const P3 = { ...DUE_TOMORROW, priority: 2 };
  const P4 = { ...DUE_TOMORROW, priority: 1 };
  const tasks = [P2, P4, P1, P3];
  const sortedTasks = sortByDueDateAndPriority(tasks);
  console.log({ tasks, sortedTasks });
  expect(sortedTasks[0].content).toBe(P1.content);
  expect(sortedTasks[1].content).toBe(P2.content);
  expect(sortedTasks[2].content).toBe(P3.content);
  expect(sortedTasks[3].content).toBe(P4.content);
  expect(sortedTasks.length).toBe(tasks.length);
});

test("order larger sample tasks with mixed due dates and priorities", () => {
  const P1 = { ...DUE_TODAY, priority: 4 };
  const P2 = { ...DUE_TOMORROW, priority: 4 };
  const P3 = { ...DUE_TOMORROW, priority: 3 };
  const P4 = { ...DUE_TOMORROW, priority: 2 };
  const P5 = { ...DUE_TOMORROW, priority: 1 };
  const P6 = { ...NO_DUE_DATE, priority: 4 };
  const P7 = { ...NO_DUE_DATE_3, priority: 3 };
  const P8 = { ...NO_DUE_DATE_2, priority: 2 };
  const P9 = { ...NO_DUE_DATE, priority: 1 };

  const tasks = [P2, P4, P1, P3, P6, P8, P5, P7, P9];
  const sortedTasks = sortByDueDateAndPriority(tasks);
  expect(sortedTasks[0].content).toBe(P1.content);
  expect(sortedTasks[1].content).toBe(P2.content);
  expect(sortedTasks[2].content).toBe(P3.content);
  expect(sortedTasks[3].content).toBe(P4.content);
  expect(sortedTasks[4].content).toBe(P5.content);
  expect(sortedTasks[5].content).toBe(P6.content);
  expect(sortedTasks[6].content).toBe(P7.content);
  expect(sortedTasks[7].content).toBe(P8.content);
  expect(sortedTasks[8].content).toBe(P9.content);
  expect(sortedTasks.length).toBe(tasks.length);
});

test("order tasks with past and future due dates", () => {
  const P1 = { ...PAST_DUE_DATE, priority: 4 };
  const P2 = { ...DUE_TODAY, priority: 4 };
  const P3 = { ...DUE_TOMORROW, priority: 3 };

  const tasks = [P2, P1, P3];
  const sortedTasks = sortByDueDateAndPriority(tasks);
  expect(sortedTasks[0].content).toBe(P1.content);
  expect(sortedTasks[1].content).toBe(P2.content);
  expect(sortedTasks[2].content).toBe(P3.content);
  expect(sortedTasks.length).toBe(tasks.length);
});
