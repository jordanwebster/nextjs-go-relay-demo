import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import type { pagesQuery as TaskListQueryType } from "../../__generated__/pagesQuery.graphql";
import TaskList from "@/components/TaskList";

const TaskListQuery = graphql`
  query pagesQuery {
    ...TaskListFragment
  }
`;

export default function Home() {
  const data = useLazyLoadQuery<TaskListQueryType>(TaskListQuery, {});
  return <TaskList tasks={data} />;
}
