import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { TaskFragment$key } from "../../__generated__/TaskFragment.graphql";

const TaskFragment = graphql`
  fragment TaskFragment on Todo {
    id
    text
    status
    priority
  }
`;

type Props = {
  task: TaskFragment$key;
};

export default function Task({ task }: Props) {
  const data = useFragment(TaskFragment, task);
  return <span>{data.text}</span>;
}
