import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useMutation, usePaginationFragment } from "react-relay";
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
      __id
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

const TaskListAddTaskMutation = graphql`
  mutation TaskListAddTaskMutation(
    $connections: [ID!]!
    $input: CreateTodoInput!
  ) {
    createTodo(input: $input)
      @prependNode(connections: $connections, edgeTypeName: "TodoEdge") {
      ...TaskFragment
    }
  }
`;
const TaskListDeleteTaskMutation = graphql`
  mutation TaskListDeleteTaskMutation($connections: [ID!]!, $id: ID!) {
    deleteTodo(id: $id) {
      id @deleteEdge(connections: $connections)
    }
  }
`;

type Props = {
  tasks: TaskListFragment$key;
};

export default function TaskList({ tasks }: Props) {
  const [taskTitle, setTaskTitle] = useState("");
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    TaskListFragment,
    tasks,
  );
  const [addTask, _isAddTaskMutationInFlight] = useMutation(
    TaskListAddTaskMutation,
  );
  const [deleteTask, _isDeleteTaskMutationInFlight] = useMutation(
    TaskListDeleteTaskMutation,
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTaskTitle(event.target.value);
    },
    [setTaskTitle],
  );

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      addTask({
        variables: {
          input: {
            text: taskTitle,
          },
          connections: [data.todos.__id],
        },
      });
      setTaskTitle("");
    },
    [taskTitle, setTaskTitle, addTask, data.todos],
  );

  const onDeleteTask = useCallback(
    (id: string) => {
      deleteTask({
        variables: {
          id: id,
          connections: [data.todos.__id],
        },
      });
    },
    [deleteTask, data.todos],
  );

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Create new task"
          value={taskTitle}
          onChange={onChange}
        />
        <button type="submit">Create</button>
      </form>
      <ul>
        {data.todos.edges?.map(
          (edge) =>
            edge?.node && (
              <li key={edge.node.id}>
                <Task task={edge.node} onDeleteTask={onDeleteTask} />
              </li>
            ),
        )}
      </ul>
      <button
        type="button"
        disabled={isLoadingNext || !hasNext}
        onClick={() => loadNext(5)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-50 disabled:text-slate-500"
      >
        Load More
      </button>
    </>
  );
}
