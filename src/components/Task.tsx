import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { TaskFragment$key } from "../../__generated__/TaskFragment.graphql";

const TaskFragment = graphql`
  fragment TaskFragment on Task {
    id
    text
    status
    priority
  }
`;

type Props = {
  task: TaskFragment$key;
  onDeleteTask: (id: string) => void;
};

export default function Task({ task, onDeleteTask }: Props) {
  const data = useFragment(TaskFragment, task);
  return (
    <div>
      <span>{data.text}</span>
      <button type="button" onClick={() => onDeleteTask(data.id)}>
        Mark as done
      </button>
    </div>
  );
}
