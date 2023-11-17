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
  const inputId = `input${data.id}`;
  return (
    <div className="flex items-center">
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        onClick={() => onDeleteTask(data.id)}
      />
      <label htmlFor={inputId} className="ml-3 block text-gray-900">
        <span className="text-lg font-medium">{data.text}</span>
      </label>
    </div>
  );
}
