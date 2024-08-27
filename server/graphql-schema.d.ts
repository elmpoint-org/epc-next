/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: 'Mutation';
  subscription: never;
  types: {
    'Boolean': unknown;
    'CMSFile': { kind: 'OBJECT'; name: 'CMSFile'; fields: { 'lastModified': { name: 'lastModified'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'path': { name: 'path'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'size': { name: 'size'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; }; };
    'CMSFileListOutput': { kind: 'OBJECT'; name: 'CMSFileListOutput'; fields: { 'files': { name: 'files'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSFile'; ofType: null; }; }; }; } }; 'isComplete': { name: 'isComplete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; }; };
    'CMSFileMoveChanges': { kind: 'INPUT_OBJECT'; name: 'CMSFileMoveChanges'; isOneOf: false; inputFields: [{ name: 'path'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'newPath'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }]; };
    'CMSFileUploadOutput': { kind: 'OBJECT'; name: 'CMSFileUploadOutput'; fields: { 'uri': { name: 'uri'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'url': { name: 'url'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'CMSImage': { kind: 'OBJECT'; name: 'CMSImage'; fields: { 'author': { name: 'author'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'confirmed': { name: 'confirmed'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'ext': { name: 'ext'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'mime': { name: 'mime'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'page': { name: 'page'; type: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; 'uri': { name: 'uri'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'url': { name: 'url'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'CMSImageUploadOutput': { kind: 'OBJECT'; name: 'CMSImageUploadOutput'; fields: { 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'url': { name: 'url'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'CMSPage': { kind: 'OBJECT'; name: 'CMSPage'; fields: { 'content': { name: 'content'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'contributors': { name: 'contributors'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'publish': { name: 'publish'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'secure': { name: 'secure'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'slug': { name: 'slug'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; 'title': { name: 'title'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Cabin': { kind: 'OBJECT'; name: 'Cabin'; fields: { 'aliases': { name: 'aliases'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'rooms': { name: 'rooms'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; }; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; }; };
    'CabinCreate': { kind: 'INPUT_OBJECT'; name: 'CabinCreate'; isOneOf: false; inputFields: [{ name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'aliases'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; }; defaultValue: null }]; };
    'CustomRoom': { kind: 'OBJECT'; name: 'CustomRoom'; fields: { 'text': { name: 'text'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'ID': unknown;
    'Int': unknown;
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'cabinCreate': { name: 'cabinCreate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Cabin'; ofType: null; }; } }; 'cabinCreateMultiple': { name: 'cabinCreateMultiple'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Cabin'; ofType: null; }; }; }; } }; 'cabinDelete': { name: 'cabinDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Cabin'; ofType: null; }; } }; 'cabinUpdate': { name: 'cabinUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Cabin'; ofType: null; }; } }; 'cmsFileCreateFolder': { name: 'cmsFileCreateFolder'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'cmsFileDelete': { name: 'cmsFileDelete'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'cmsFileMove': { name: 'cmsFileMove'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'cmsFileUpload': { name: 'cmsFileUpload'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSFileUploadOutput'; ofType: null; }; } }; 'cmsImageConfirm': { name: 'cmsImageConfirm'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; }; } }; 'cmsImageDelete': { name: 'cmsImageDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; }; } }; 'cmsImageDeleteMultiple': { name: 'cmsImageDeleteMultiple'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; }; }; } }; 'cmsImageDeleteUnconfirmed': { name: 'cmsImageDeleteUnconfirmed'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; }; }; } }; 'cmsImageUpdate': { name: 'cmsImageUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; }; } }; 'cmsImageUpload': { name: 'cmsImageUpload'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImageUploadOutput'; ofType: null; }; } }; 'cmsPageCreate': { name: 'cmsPageCreate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; } }; 'cmsPageDelete': { name: 'cmsPageDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; } }; 'cmsPageUpdate': { name: 'cmsPageUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; } }; 'preUserCreate': { name: 'preUserCreate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; } }; 'preUserDelete': { name: 'preUserDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; } }; 'preUserUpdate': { name: 'preUserUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; } }; 'roomCreate': { name: 'roomCreate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; } }; 'roomCreateMultiple': { name: 'roomCreateMultiple'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; }; }; } }; 'roomDelete': { name: 'roomDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; } }; 'roomUpdate': { name: 'roomUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; } }; 'stayCreate': { name: 'stayCreate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Stay'; ofType: null; }; } }; 'stayDelete': { name: 'stayDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Stay'; ofType: null; }; } }; 'stayUpdate': { name: 'stayUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Stay'; ofType: null; }; } }; 'userCreate': { name: 'userCreate'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userCreateCredential': { name: 'userCreateCredential'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'userDelete': { name: 'userDelete'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userDeleteCredential': { name: 'userDeleteCredential'; type: { kind: 'OBJECT'; name: 'UserCredential'; ofType: null; } }; 'userResetSecret': { name: 'userResetSecret'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userUpdate': { name: 'userUpdate'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; }; };
    'PreUser': { kind: 'OBJECT'; name: 'PreUser'; fields: { 'email': { name: 'email'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'scope': { name: 'scope'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'UserScopeProp'; ofType: null; }; }; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'cabin': { name: 'cabin'; type: { kind: 'OBJECT'; name: 'Cabin'; ofType: null; } }; 'cabins': { name: 'cabins'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'Cabin'; ofType: null; }; }; } }; 'cmsFilePresign': { name: 'cmsFilePresign'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'cmsFiles': { name: 'cmsFiles'; type: { kind: 'OBJECT'; name: 'CMSFileListOutput'; ofType: null; } }; 'cmsImage': { name: 'cmsImage'; type: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; } }; 'cmsImages': { name: 'cmsImages'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; }; }; } }; 'cmsImagesFromPageId': { name: 'cmsImagesFromPageId'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSImage'; ofType: null; }; }; } }; 'cmsPage': { name: 'cmsPage'; type: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; } }; 'cmsPageFromSlug': { name: 'cmsPageFromSlug'; type: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; } }; 'cmsPages': { name: 'cmsPages'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; }; } }; 'preUser': { name: 'preUser'; type: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; } }; 'preUserFromEmail': { name: 'preUserFromEmail'; type: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; } }; 'preUsers': { name: 'preUsers'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; }; } }; 'room': { name: 'room'; type: { kind: 'OBJECT'; name: 'Room'; ofType: null; } }; 'rooms': { name: 'rooms'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; }; } }; 'roomsById': { name: 'roomsById'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; }; } }; 'roomsFromCabin': { name: 'roomsFromCabin'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; }; } }; 'roomsNoCabin': { name: 'roomsNoCabin'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'Room'; ofType: null; }; }; } }; 'stay': { name: 'stay'; type: { kind: 'OBJECT'; name: 'Stay'; ofType: null; } }; 'stays': { name: 'stays'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Stay'; ofType: null; }; }; }; } }; 'staysInRoom': { name: 'staysInRoom'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Stay'; ofType: null; }; }; }; } }; 'user': { name: 'user'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userFromAuth': { name: 'userFromAuth'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userFromEmail': { name: 'userFromEmail'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userSECURE': { name: 'userSECURE'; type: { kind: 'OBJECT'; name: 'UserSECURE'; ofType: null; } }; 'users': { name: 'users'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; }; } }; }; };
    'Room': { kind: 'OBJECT'; name: 'Room'; fields: { 'aliases': { name: 'aliases'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; } }; 'availableBeds': { name: 'availableBeds'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'beds': { name: 'beds'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; 'cabin': { name: 'cabin'; type: { kind: 'OBJECT'; name: 'Cabin'; ofType: null; } }; 'forCouples': { name: 'forCouples'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'noCount': { name: 'noCount'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; }; };
    'RoomCreate': { kind: 'INPUT_OBJECT'; name: 'RoomCreate'; isOneOf: false; inputFields: [{ name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'aliases'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; }; defaultValue: null }, { name: 'cabinId'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'beds'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; }; defaultValue: null }, { name: 'forCouples'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; defaultValue: null }, { name: 'noCount'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; defaultValue: null }]; };
    'RoomOrCustomRoom': { kind: 'UNION'; name: 'RoomOrCustomRoom'; fields: {}; possibleTypes: 'CustomRoom' | 'Room'; };
    'Stay': { kind: 'OBJECT'; name: 'Stay'; fields: { 'author': { name: 'author'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'dateEnd': { name: 'dateEnd'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; 'dateStart': { name: 'dateStart'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; 'description': { name: 'description'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'reservations': { name: 'reservations'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'StayReservation'; ofType: null; }; }; }; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; 'title': { name: 'title'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'StayReservation': { kind: 'OBJECT'; name: 'StayReservation'; fields: { 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'room': { name: 'room'; type: { kind: 'UNION'; name: 'RoomOrCustomRoom'; ofType: null; } }; }; };
    'StayReservationInput': { kind: 'INPUT_OBJECT'; name: 'StayReservationInput'; isOneOf: false; inputFields: [{ name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'roomId'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'customText'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }]; };
    'String': unknown;
    'TS': { kind: 'OBJECT'; name: 'TS'; fields: { 'created': { name: 'created'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; 'updated': { name: 'updated'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; }; };
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'credentials': { name: 'credentials'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'UserCredential'; ofType: null; }; }; } }; 'email': { name: 'email'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'firstName': { name: 'firstName'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'scope': { name: 'scope'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'UserScopeProp'; ofType: null; }; }; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; }; };
    'UserCredential': { kind: 'OBJECT'; name: 'UserCredential'; fields: { 'country': { name: 'country'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'createdAt': { name: 'createdAt'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'device': { name: 'device'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'lastUsedAt': { name: 'lastUsedAt'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'nickname': { name: 'nickname'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'userId': { name: 'userId'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
    'UserSECURE': { kind: 'OBJECT'; name: 'UserSECURE'; fields: { 'secret': { name: 'secret'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'user': { name: 'user'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; }; };
    'UserScopeProp': { name: 'UserScopeProp'; enumValues: 'EDIT' | 'ADMIN' | 'CALENDAR_ADMIN' | 'PHOTO_VOTE' | 'PHOTO_MANAGE'; };
  };
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}