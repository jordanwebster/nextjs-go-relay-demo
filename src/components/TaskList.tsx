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
    tasks(after: $cursor, first: $count)
      @connection(key: "TaskListFragment_tasks") {
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
    $input: CreateTaskInput!
  ) {
    createTask(input: $input)
      @prependNode(connections: $connections, edgeTypeName: "TaskEdge") {
      ...TaskFragment
    }
  }
`;
const TaskListDeleteTaskMutation = graphql`
  mutation TaskListDeleteTaskMutation($connections: [ID!]!, $id: ID!) {
    deleteTask(id: $id) {
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
          connections: [data.tasks.__id],
        },
      });
      setTaskTitle("");
    },
    [taskTitle, setTaskTitle, addTask, data.tasks],
  );

  const onDeleteTask = useCallback(
    (id: string) => {
      deleteTask({
        variables: {
          id: id,
          connections: [data.tasks.__id],
        },
      });
    },
    [deleteTask, data.tasks],
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          To Do List
        </h1>
      </div>
      <form className="w-full max-w-sm mx-auto px-4 py-2" onSubmit={onSubmit}>
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            placeholder="Add a task"
            type="text"
            value={taskTitle}
            onChange={onChange}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {data.tasks?.edges?.map(
          (edge) =>
            edge?.node && (
              <li className="py-4" key={edge.node.id}>
                <Task task={edge.node} onDeleteTask={onDeleteTask} />
              </li>
            ),
        )}
      </ul>
      {hasNext && (
        <div className="p-4 flex justify-end">
          <button
            type="button"
            disabled={isLoadingNext || !hasNext}
            onClick={() => loadNext(5)}
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
