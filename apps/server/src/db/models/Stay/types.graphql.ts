import gql from 'graphql-tag';

export default gql`
  "a stay at camp, shown on the calendar."
  type Stay {
    id: ID!
    "calendar event title (as shown in webcal/ical forms)"
    title: String!
    "calendar event description (as shown in webcal/ical forms)"
    description: String!
    "the reservation's author, who should be notified about changes"
    author: User

    "date of arrival, a unix seconds timestamp"
    dateStart: Int!
    "leave date, a unix seconds timestamp"
    dateEnd: Int!

    "the room reservations associated with this stay"
    reservations: [StayReservation!]!

    "created/update timestamps"
    timestamp: TS!
  }

  type StayReservation {
    "the name of the person(s) staying in the room"
    name: String!
    "the room they're staying in"
    room: RoomOrCustomRoom
  }

  union RoomOrCustomRoom = Room | CustomRoom
  "some rooms may be custom, meaning they're just a text value the user entered"
  type CustomRoom {
    text: String!
  }

  # -------------------------------

  type Query {
    """
    **SCOPE: userId**

    get one stay by its ID
    """
    stay(id: ID!): Stay

    """
    **SCOPE: userId**

    get all stays within specified date range. \`deep\` search will take longer, but returns extremely long events as well.
    """
    stays(start: Int!, end: Int!, deep: Boolean): [Stay!]!

    """
    **SCOPE: userId**

    get all stays that are in a particular room in a particular date range
    """
    staysInRoom(roomId: String!, start: Int!, end: Int!): [Stay!]!

    """
     **SCOPE: ADMIN**

    get the most recent update timestamp after the provided time.
    """
    stayMostRecentTimestamp(after: Int!): Int!

    """
     **SCOPE: CALENDAR_ADMIN | userId=authorId**

    get all stays created by a certain author.
    """
    staysFromAuthor(authorId: String!): [Stay!]!
  }

  type Mutation {
    """
    **SCOPE: userId**

    create a new stay
    """
    stayCreate(
      title: String!
      description: String!
      authorId: ID!
      dateStart: Int!
      dateEnd: Int!
      reservations: [StayReservationInput!]!
    ): Stay!

    """
    **SCOPE: CALENDAR_ADMIN | userId=authorId | author's trustedUser**

    update an existing stay.
    """
    stayUpdate(
      id: ID!
      title: String
      description: String
      authorId: ID
      dateStart: Int
      dateEnd: Int
      reservations: [StayReservationInput!]
    ): Stay!

    """
    **SCOPE: CALENDAR_ADMIN | userId=authorId | author's trustedUser**

    delete an existing stay.
    """
    stayDelete(id: ID!): Stay!

    """
    **SCOPE: CALENDAR_ADMIN | userId=authorId | author's trustedUser**

    split an existing stay in two around a date. returns the **newly created stay**--the original stay will be shortened to end on the specified date, and a new date will be created starting on that date.
    """
    staySplit(id: ID!, date: Int!): Stay!
  }

  "a room reservation for the stay. you must provide EITHER a roomId or customText."
  input StayReservationInput {
    name: String!
    roomId: String
    customText: String
  }
`;
