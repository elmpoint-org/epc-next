import gql from 'graphql-tag';

export default gql`
  """
  a user-created page available on the website at /content/.
  """
  type CMSPage {
    id: ID!
    slug: String!
    title: String!
    content: String!
    secure: Boolean!
    contributors: [User]!

    timestamp: TS!
  }

  type Query {
    """
    **SCOPE: userId**

    get all pages.
    """
    cmsPages: [CMSPage]!

    """
    **SCOPE: userId**

    get a page by its id.
    """
    cmsPage(id: ID!): CMSPage

    """
    **SCOPE: ***

    get a page by its slug, ie from a GET request.
    """
    cmsPageFromSlug(slug: String!): CMSPage
  }

  type Mutation {
    """
    **SCOPE: ADMIN | EDIT**

    create new page.
    """
    cmsPageCreate(
      slug: String!
      title: String!
      content: String!
      secure: Boolean!
      contributorAdd: String
    ): CMSPage!

    """
    **SCOPE: ADMIN | EDIT**

    update a page.
    """
    cmsPageUpdate(
      id: ID!
      slug: String
      title: String
      content: String
      secure: Boolean
      contributorAdd: String
      contributorRemove: String
    ): CMSPage!

    """
    **SCOPE: ADMIN | EDIT**

    delete a page. for non-admins, a user can only delete a page if they have contributed to it.
    """
    cmsPageDelete(id: ID!): CMSPage!
  }
`;
