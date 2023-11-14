"use client";

import TaskList from "@/components/TaskList";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import type { pageQuery as TaskListQueryType } from "../../__generated__/pageQuery.graphql";

const TaskListQuery = graphql`
  query pageQuery {
    ...TaskListFragment
  }
`;

export default function Home() {
  const query = useLazyLoadQuery<TaskListQueryType>(TaskListQuery, {});
  return <TaskList tasks={query} />;
}
