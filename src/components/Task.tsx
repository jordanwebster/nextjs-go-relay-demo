import { graphql } from "relay-runtime";

const TaskFragment = graphql`
  fragment TaskFragment on Todo {
    id
    text
    status
    priority
  }
`;

type Props = {};

export default function Task() {}

