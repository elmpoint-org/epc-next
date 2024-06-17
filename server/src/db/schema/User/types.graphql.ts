import gql from 'graphql-tag';

export default gql`
  "type for an application user"
  type User {
    # __ USER DATA __
    "unique id (UUIDv4)"
    id: ID!
    "the user's email"
    email: String!
    "the user's full name"
    name: String
    "the user's first name"
    firstName: String

    # __ AUTH DATA __
    "scope defines a user's permissions."
    scope: [UserScopeProp!]
    credentials: [UserCredential!]

    "create/update history for this entry"
    timestamp: TS!
  }
  "this type can only be accessed on the server. it is for retreiving secure authentication data."
  type UserSECURE {
    user: User!
    "the user's secret is used to authenticate user operations. while it cannot be accessed through external requests, users can reset it (which will effectively log them out of all devices)."
    secret: String!
  }

  "allowed permissions for app users, to be stored in scope arrays."
  enum UserScopeProp {
    # __ GLOBAL SCOPES __
    "allows a user to edit CMS data, such as website and calendar data"
    EDIT
    "full site administrator access"
    ADMIN

    # __ PHOTO CONTEST SPECIFIC __
    "allows a user to vote in the photo contest"
    PHOTO_VOTE
    "allows a user to see current photo contest stats"
    PHOTO_MANAGE
  }

  "a passkey registered to the user"
  type UserCredential {
    id: ID!
    userId: String
    createdAt: String
    lastUsedAt: String
    country: String
    device: String
    nickname: String
  }

  # ---------------------------

  type Query {
    """
    **SCOPE: ADMIN**

    get all users
    """
    users: [User!]

    """
    **SCOPE: authorized**

    get single user by ID. can bypass scope if user is getting info for their own user.
    """
    user(id: ID!): User

    """
    **SCOPE: ADMIN**

    find a user by their email.
    """
    userFromEmail(email: String!): User

    """
    **SCOPE: userId==id**

    get user from currently logged in account.
    """
    userFromAuth: User

    """
    **SCOPE: internal only**

    this obtains a user object with its authentication information—it is only accessible from internal server functions.
    """
    userSECURE(id: ID!): UserSECURE
  }

  type Mutation {
    """
    **SCOPE: ADMIN | internal**

    create a new user. users are created through the HTTP API only on the basis of referrals.
    """
    userCreate(
      name: String!
      firstName: String!
      email: String!
      scope: [UserScopeProp!]
    ): User

    """
    **SCOPE: userId==id | ADMIN**

    update user info. can bypass scope if editing your own user.
    """
    userUpdate(
      id: ID!
      name: String
      firstName: String
      email: String
      scope: [UserScopeProp!]
    ): User

    """
    **SCOPE: userId==id | ADMIN**

    delete a user. can bypass scope if editing your own user.
    """
    userDelete(id: ID!): User

    """
    **SCOPE: userId==id | ADMIN**

    reset user secret. this will be invalidate all current authorization tokens.
    """
    userResetSecret(id: ID!): User

    """
    **SCOPE: userId==id**

    get a token to create a new passkey credential for your own user. all users may only do this for themselves.
    """
    userCreateCredential: String!

    """
    **SCOPE: userId==id**

    delete a passkey credential from your own user. all users may only do this for themselves.
    """
    userDeleteCredential(id: ID!): UserCredential
  }
`;
