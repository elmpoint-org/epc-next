import gql from 'graphql-tag';

export default gql`
  type Payment {
    id: ID!

    timestamp: TS!
  }
`;
