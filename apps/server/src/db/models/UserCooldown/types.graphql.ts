import gql from 'graphql-tag';

export default gql`
  type UserCooldown {
    id: ID!
    "user these cooldowns apply to"
    user: User

    "last time the user sent a login email request"
    nextLoginEmail: Int

    timestamp: TS!
  }

  "see UserCooldown type for property information"
  input UserCooldownUpdateOpts {
    nextLoginEmail: Int
  }

  type Query {
    """
    **SCOPE: ADMIN | userId**

    get user cooldown info (when they've most recently done quota-limited operations)
    """
    userCooldown(userId: ID!): UserCooldown
  }

  type Mutation {
    """
    **SCOPE: ADMIN | internal**

    update a cooldown time for a user.
    """
    userCooldownUpdate(
      userId: ID!
      updates: UserCooldownUpdateOpts!
    ): UserCooldown!

    """
    **SCOPE: ADMIN | internal**

    purge all cooldowns.
    """
    userCooldownPurge: [UserCooldown]!
  }
`;
