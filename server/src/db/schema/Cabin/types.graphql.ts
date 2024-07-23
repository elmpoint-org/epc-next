import gql from 'graphql-tag';

export default gql`
  """
  a cabin, which contains rooms that people can stay in. cabin is a loose term for anywhere with a set of places to sleep.
  """
  type Cabin {
    id: ID!

    "the cabin's primary name"
    name: String!
    "a set of common nicknames for the cabin which can be used to search for it"
    aliases: [String!]!

    "the rooms available inside this cabin"
    rooms: [Room]!

    timestamp: TS!
  }

  # --------------------------

  type Query {
    """
    **SCOPE: userId**

    get all cabins
    """
    cabins: [Cabin]!

    """
    **SCOPE: userId**

    get one cabin
    """
    cabin(id: ID!): Cabin
  }

  type Mutation {
    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    create a new cabin
    """
    cabinCreate(name: String!, aliases: [String!]!): Cabin!

    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    update a cabin
    """
    cabinUpdate(id: ID!, name: String, aliases: [String!]): Cabin!

    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    delete a cabin
    """
    cabinDelete(id: ID!): Cabin!

    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    create multiple cabins at once
    """
    cabinCreateMultiple(cabins: [CabinCreate!]!): [Cabin!]!
  }

  input CabinCreate {
    name: String!
    aliases: [String!]!
  }
`;
