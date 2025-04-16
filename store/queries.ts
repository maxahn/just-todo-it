import { createQueries } from "tinybase/queries";
import { store, TASK_TABLE_ID } from ".";

export const QUERY_ID = {
  incompleteTasks: "incompleteTasks",
};

export const queries = createQueries(store).setQueryDefinition(
  QUERY_ID.incompleteTasks,
  TASK_TABLE_ID,
  ({ select, where }) => {
    select("id");
    select("order");
    where("isCompleted", false);
  },
);

export default queries;
