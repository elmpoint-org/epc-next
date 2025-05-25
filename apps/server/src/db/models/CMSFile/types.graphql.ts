import gql from 'graphql-tag';

export default gql`
  "a file available in the CMS file manager."
  type CMSFile {
    "the directory path to the file, including its filename"
    path: String!
    "last modified date"
    lastModified: Int
    "number of bytes in file"
    size: Int
  }

  # ---------------------------

  type Query {
    """
    **SCOPE: userId**

    list all files in a folder, specified by 'root'. use startAfter to continue a previous request.
    """
    cmsFiles(
      root: String
      max: Int
      startAfter: String
      recursive: Boolean
    ): CMSFileListOutput

    """
    **SCOPE: userId**

    get a presigned url for a file path.
    """
    cmsFilePresign(path: String!): String
  }

  type Mutation {
    """
    **SCOPE: ADMIN | EDIT**

    begin an file upload. pass the file name (containing a valid file extension) to get a presigned upload url.
    """
    cmsFileUpload(fileName: String!, root: String!): CMSFileUploadOutput!

    """
    **SCOPE: ADMIN | EDIT**

    create a blank folder at \`root\` path. root must end in \`/\`.
    """
    cmsFileCreateFolder(root: String!): Boolean

    """
    **SCOPE: ADMIN | EDIT**

    move or copy any number of files. returns the number of successful operations. set \`copy=true\` to make a new copy. use this for renaming as well.
    """
    cmsFileMove(changes: [CMSFileMoveChanges!]!, copy: Boolean): Int

    """
    **SCOPE: ADMIN | EDIT**

    delete any number of files.
    """
    cmsFileDelete(paths: [String!]!): Boolean
  }

  input CMSFileMoveChanges {
    path: String!
    newPath: String!
  }

  type CMSFileUploadOutput {
    "the new file's S3 URI, which should be used to confirm the upload once complete."
    uri: String!
    "the upload url. send a PUT request to this url with the file to upload."
    url: String!
  }

  type CMSFileListOutput {
    files: [CMSFile!]!
    isComplete: Boolean!
  }
`;
