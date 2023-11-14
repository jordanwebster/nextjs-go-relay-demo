import { graphql } from 'relay-runtime';

const TaskListFragment = graphql`
  fragment TaskListFragment on Query {
    todos {

    }
    title
    summary
    createdAt
    poster {
      name
      profilePicture {
        url
      }
    }
    thumbnail {
      url
    }
  }
`;

export default function TasksList() {}