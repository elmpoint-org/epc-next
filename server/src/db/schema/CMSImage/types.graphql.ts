import gql from 'graphql-tag';

export default gql`
  """
  a user-uploaded image, currently for use in CMS pages.
  """
  type CMSImage {
    id: ID!
    "the file name for this image."
    name: String
    "the file extension of the image"
    ext: String!
    "the MIME type of the image"
    mime: String!
    "the unresolved URI string, which may be an unsigned S3 URI."
    uri: String!
    "the resolved URL for the image, presigned if necessary."
    url: String!
    "whether this image was confirmed as succesfully uploaded. unconfirmed images will be periodically purged."
    confirmed: Boolean!

    # relational
    "the user who uploaded this image."
    author: User
    "the page this image is displayed on."
    page: CMSPage
    timestamp: TS!
  }

  type CMSImageUploadOutput {
    "the new image's id, which should be used to confirm the upload once complete."
    id: String!
    "the upload url. send a PUT request to this url with the file to upload."
    url: String!
  }

  # --------------------------

  type Query {
    """
    **SCOPE: ADMIN | EDIT**

    get all CMS images
    """
    cmsImages: [CMSImage]!

    """
    **SCOPE: !public? userId**

    get a single CMS image
    """
    cmsImage(id: ID!): CMSImage

    """
    **SCOPE: ADMIN | EDIT**

    get all images associated with a page
    """
    cmsImagesFromPageId(pageId: ID!, confirmed: Boolean): [CMSImage]!
  }

  type Mutation {
    """
    **SCOPE: ADMIN | EDIT**

    begin an image upload. pass the file name (containing a valid file extension) to get a presigned upload url.
    """
    cmsImageUpload(fileName: String!, pageId: String!): CMSImageUploadOutput!
    """
    **SCOPE: ADMIN | EDIT**

    confirm image upload. once the image was successfully uploaded, run this to "save" the image.
    """
    cmsImageConfirm(id: ID!): CMSImage!
    """
    **SCOPE: ADMIN | EDIT**

    update a CMS image
    """
    cmsImageUpdate(
      id: ID!
      name: String
      authorId: String
      pageId: String
      public: Boolean
    ): CMSImage!
    """
    **SCOPE: ADMIN | EDIT**

    delete a CMS image (this also deletes the stored file)
    """
    cmsImageDelete(id: ID!): CMSImage!

    """
    **SCOPE: ADMIN | EDIT**

    delete a set of CMS images (this also deletes their stored files)
    """
    cmsImageDeleteMultiple(ids: [ID!]!): [CMSImage]!

    """
    **SCOPE: ADMIN | EDIT**

    delete all images that haven't been confirmed as uploaded
    """
    cmsImageDeleteUnconfirmed: [CMSImage]!
  }
`;
