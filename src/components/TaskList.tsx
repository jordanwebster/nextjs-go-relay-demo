import { useTransition } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { TaskListFragment$key } from "../../__generated__/TaskListFragment.graphql";
import Task from "./Task";

const TaskListFragment = graphql`
  fragment TaskListFragment on Query
  @refetchable(queryName: "TaskListPaginationQuery")
  @argumentDefinitions(
    cursor: { type: "Cursor" }
    count: { type: "Int", defaultValue: 5 }
  ) {
    todos(after: $cursor, first: $count)
      @connection(key: "TaskListFragment_todos") {
      pageInfo {
        startCursor
        hasNextPage
      }
      edges {
        node {
          id
          ...TaskFragment
        }
      }
    }
  }
`;

type Props = {
  tasks: TaskListFragment$key;
};

export default function TaskList({ tasks }: Props) {
  const [isPending, startTransition] = useTransition();
  const { data, loadNext } = usePaginationFragment(TaskListFragment, tasks);
  return (
    <>
      <ul>
        {data.todos.edges.map((edge) => (
          <li key={edge.node.id}>
            <Task task={edge.node} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(() => loadNext(5));
        }}
      >
        Load More
      </button>
    </>
  );
}
