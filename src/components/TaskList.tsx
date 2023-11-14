import { graphql } from "relay-runtime";
import { TaskListFragment$key } from "../../__generated__/TaskListFragment.graphql";
import { useFragment } from "react-relay";
import Task from "./Task";
import { TaskFragment$key } from "../../__generated__/TaskFragment.graphql";

const TaskListFragment = graphql`
  fragment TaskListFragment on Query {
    todos {
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
  const data = useFragment(TaskListFragment, tasks);
  return (
    <ul>
      {data.todos.edges.map((edge) => (
        <li key={edge.node.id}>
          <Task task={edge.node} />
        </li>
      ))}
    </ul>
  );
}
