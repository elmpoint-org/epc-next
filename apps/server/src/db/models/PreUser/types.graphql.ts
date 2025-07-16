import gql from 'graphql-tag';

export default gql`
  """
  an invited user, pre-registration. created by referrals or invitations, and deleted once a full user is created.
  """
  type PreUser {
    id: ID!
    email: String!
    name: String
    scope: [UserScopeProp!]

    "cooldown/quota data for user (ADMIN scope)"
    cooldowns: UserCooldown

    timestamp: TS!
  }

  type Query {
    """
    **SCOPE: admin**

    get all pre-registered users.
    """
    preUsers: [PreUser!]

    """
    **SCOPE: admin**

    get specific preuser
    """
    preUser(id: ID!): PreUser

    """
    **SCOPE: admin**

    get preuser by their email address
    """
    preUserFromEmail(email: String!): PreUser
  }

  type Mutation {
    """
    **SCOPE: userId**

    create a new pre-registered user. any user can invite another user.
    """
    preUserCreate(email: String!, name: String): PreUser!

    """
    **SCOPE: ADMIN**

    create multiple pre-registered users.
    """
    preUserCreateMultiple(users: [PreUserCreateMultipleInput!]!): [PreUser!]!

    """
    **SCOPE: admin**

    update a preuser
    """
    preUserUpdate(id: ID!, name: String, scope: [UserScopeProp!]): PreUser!

    """
    **SCOPE: admin**

    delete a preuser (usually because a full user has been created)
    """
    preUserDelete(id: ID!): PreUser!
  }

  input PreUserCreateMultipleInput {
    email: String!
    name: String
  }
`;
