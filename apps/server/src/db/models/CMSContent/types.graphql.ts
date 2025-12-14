import gql from 'graphql-tag';

export default gql`
  type CMSBanner {
    id: ID!

    "the banner's text"
    text: String!
    "(optional) call to action link"
    link: CMSBannerLink
    "(optional) banner's color"
    color: CMSBannerColor

    "user who created the banner"
    author: User

    "(optional) date TS when to start showing the banner"
    date_start: Int
    "(optional) date TS when to delete this banner"
    date_end: Int

    timestamp: TS!
  }
  type CMSBannerLink {
    text: String!
    href: String!
  }
  input CMSBannerLinkInput {
    text: String!
    href: String!
  }
  enum CMSBannerColor {
    green
    red
    orange
    yellow
    blue
    purple
    gray
  }

  # ------------------------------------

  type Query {
    """
    SCOPE: *

    get all homepage banners
    """
    cmsBanners: [CMSBanner!]!

    """
    SCOPE: *

    get homepage banners which are currently scheduled to be shown
    """
    cmsBannersNow: [CMSBanner!]!
  }
  type Mutation {
    """
    SCOPE: ADMIN | EDIT

    create a new homepage banner. must provide text, all other attributes optional.
    """
    cmsBannerCreate(
      text: String!
      link: CMSBannerLinkInput
      color: CMSBannerColor

      date_start: Int
      date_end: Int
    ): CMSBanner!

    """
    SCOPE: ADMIN | EDIT

    update an existing homepage banner
    """
    cmsBannerUpdate(
      id: ID!
      text: String
      link: CMSBannerLinkInput
      color: CMSBannerColor

      date_start: Int
      date_end: Int
    ): CMSBanner!

    """
    SCOPE: ADMIN | EDIT

    delete a homepage banner
    """
    cmsBannerDelete(id: ID!): CMSBanner!

    """
    SCOPE: ADMIN | EDIT

    delete multiple homepage banners
    """
    cmsBannerDeleteMultiple(ids: [ID!]!): [CMSBanner]!
  }
`;
