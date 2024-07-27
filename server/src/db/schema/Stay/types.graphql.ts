import gql from 'graphql-tag';

export default gql`
  type Stay {
    id: ID!
    author: User
    dateStart: String!
    dateEnd: String!
    reservations: [StayReservation!]!

    timestamp: TS!
  }

  type StayReservation {
    name: String!
    room: Room
  }

  # -------------------------------

  type Query {
    stay(id: ID!): Stay
    stays(start: String!, end: String!): [Stay]!
  }
`;
