import gql from 'graphql-tag';

export default gql`
  """
  a room at camp. rooms are a loose term used to define any place users may sleep, such as bedrooms, tentfloors, or statuses like 'day tripper'.
  """
  type Room {
    id: ID!
    "the room's primary name"
    name: String!
    "a set of common nicknames for the room which can be used to search for it"
    aliases: [String!]!

    "the cabin the room is inside, if applicable"
    cabin: Cabin
    "the number of beds in the room"
    beds: Int!
    "the number of currently unreserved beds in this room. provide a unix timestamp for a start and end date."
    availableBeds(start: Int, end: Int): Int

    "does this room have a bed big enough for two people"
    forCouples: Boolean
    "if true, this room does not track beds or bed availability"
    noCount: Boolean

    timestamp: TS!
  }

  # --------------------------

  type Query {
    """
    **SCOPE: userId**

    get all rooms
    """
    rooms: [Room]!

    """
    **SCOPE: userId**

    get one room
    """
    room(id: ID!): Room

    """
    **SCOPE: userId**

    get multiple rooms by their IDs
    """
    roomsById(ids: [ID!]!): [Room]!

    """
    **SCOPE: userId**

    get all "root" rooms with no cabin
    """
    roomsNoCabin: [Room]!

    """
    **SCOPE: userId**

    get all rooms in a cabin
    """
    roomsFromCabin(cabinId: String!): [Room]!
  }

  type Mutation {
    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    create a new room
    """
    roomCreate(
      name: String!
      aliases: [String!]!

      cabinId: String!
      beds: Int!

      forCouples: Boolean
      noCount: Boolean
    ): Room!

    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    update an existing room
    """
    roomUpdate(
      id: ID!
      name: String
      aliases: [String!]

      cabinId: String
      beds: Int

      forCouples: Boolean
      noCount: Boolean
    ): Room!

    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    delete a room
    """
    roomDelete(id: ID!): Room!

    """
    **SCOPE: ADMIN | CALENDAR_ADMIN**

    create multiple rooms at once
    """
    roomCreateMultiple(rooms: [RoomCreate!]!): [Room!]!
  }

  input RoomCreate {
    name: String!
    aliases: [String!]!

    cabinId: String!
    beds: Int!

    forCouples: Boolean
    noCount: Boolean
  }
`;
