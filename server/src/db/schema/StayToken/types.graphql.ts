import gql from 'graphql-tag';

export default gql`
  type StayToken {
    id: ID!
    "validation token"
    token: String!
    "user who created the token"
    user: User

    timestamp: TS!
  }

  # -----------------------------

  type Query {
    """
    **SCOPE: ADMIN**

    get all stay tokens.
    """
    stayTokens: [StayToken!]!

    """
    **SCOPE: userId**

    get stay token by its ID.
    """
    stayToken(id: ID!): StayToken

    """
    **SCOPE: * **

    validate a stay token--used to serve ical/webcal endpoints
    """
    stayTokenValidate(token: String!): StayToken

    """
    **SCOPE: ADMIN | userId===tokenUser**

    get all stay tokens registered to a user.
    """
    stayTokensFromUser(userId: ID!): [StayToken!]!
  }

  type Mutation {
    """
    **SCOPE: userId**

    create a new stay token. by default, if the user already has a stay token, that will be returned. if \`forceDuplicate\` is enabled, a new token will be generated no matter what.
    """
    stayTokenCreate(forceDuplicate: Boolean): StayToken!

    """
    **SCOPE: ADMIN  | userId==tokenUser**

    delete a stayToken
    """
    stayTokenDelete(id: ID!): StayToken!
  }
`;
