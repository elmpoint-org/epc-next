import gql from 'graphql-tag';

export default gql`
  """
  an invited user, pre-registration. created by referrals or invitations, and deleted once a full user is created.
  """
  type PreUser {
    id: ID!
    email: String!
    name: String

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
    **SCOPE: admin**

    create a new pre-registered user
    """
    createPreUser(email: String!, name: String): PreUser!

    """
    **SCOPE: admin**

    update a preuser
    """
    updatePreUser(id: ID!, name: String): PreUser!

    """
    **SCOPE: admin**

    delete a preuser (usually because a full user has been created)
    """
    deletePreUser(id: ID!): PreUser!
  }
`;
