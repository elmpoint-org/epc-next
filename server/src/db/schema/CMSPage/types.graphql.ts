import gql from 'graphql-tag';

export default gql`
  """
  a user-created page available on the website at /pages/.
  """
  type CMSPage {
    id: ID!
    "permalink pathname to this page"
    slug: String
    "page title"
    title: String!
    "the page's content in prosemirror JSON format"
    content: String
    "does this page require users to login"
    secure: Boolean!
    "can this page be seen by users"
    publish: Boolean!
    "list of users who contributed to this page"
    contributors: [User]!

    timestamp: TS!
  }

  type Query {
    """
    **SCOPE: ADMIN | EDIT**

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

    get a page by its slug. If a page is secure, accessing its content requires authentication. pages without \`publish:true\` are not accessible with this method.
    """
    cmsPageFromSlug(slug: String!): CMSPage
  }

  type Mutation {
    """
    **SCOPE: ADMIN | EDIT**

    create new page.
    """
    cmsPageCreate(
      slug: String
      title: String!
      content: String
      secure: Boolean!
      publish: Boolean!
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
      publish: Boolean
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
