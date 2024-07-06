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
    "whether the image requires login to view."
    public: Boolean!
    "whether this image was confirmed as succesfully uploaded. unconfirmed images will be periodically purged."
    confirmed: Boolean!

    "the user who uploaded this image."
    author: User
    timestamp: TS!
  }

  type CMSImageUploadOutput {
    id: String!
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
  }

  type Mutation {
    """
    **SCOPE: ADMIN | EDIT**

    begin an image upload. pass the file name (containing a valid file extension) to get a presigned upload url.
    """
    cmsImageUpload(fileName: String!): CMSImageUploadOutput!
    """
    **SCOPE: ADMIN | EDIT**

    confirm image upload. once the image was successfully uploaded, run this to "save" the image.
    """
    cmsImageConfirm(id: ID!, public: Boolean): CMSImage!
    """
    **SCOPE: ADMIN | EDIT**

    update a CMS image
    """
    cmsImageUpdate(id: ID!, name: String, authorId: String): CMSImage!
    """
    **SCOPE: ADMIN | EDIT**

    delete a CMS image (this also deletes the stored file)
    """
    cmsImageDelete(id: ID!): CMSImage!

    """
    **SCOPE: ADMIN | EDIT**

    delete all images that haven't been confirmed as uploaded
    """
    cmsImageDeleteUnconfirmed: [CMSImage]!
  }
`;
