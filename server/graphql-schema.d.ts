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
    'CMSPage': { kind: 'OBJECT'; name: 'CMSPage'; fields: { 'content': { name: 'content'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'contributors': { name: 'contributors'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'secure': { name: 'secure'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'slug': { name: 'slug'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; 'title': { name: 'title'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'ID': unknown;
    'Int': unknown;
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'cmsPageCreate': { name: 'cmsPageCreate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; } }; 'cmsPageDelete': { name: 'cmsPageDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; } }; 'cmsPageUpdate': { name: 'cmsPageUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; } }; 'preUserCreate': { name: 'preUserCreate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; } }; 'preUserDelete': { name: 'preUserDelete'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; } }; 'preUserUpdate': { name: 'preUserUpdate'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; } }; 'userCreate': { name: 'userCreate'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userCreateCredential': { name: 'userCreateCredential'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'userDelete': { name: 'userDelete'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userDeleteCredential': { name: 'userDeleteCredential'; type: { kind: 'OBJECT'; name: 'UserCredential'; ofType: null; } }; 'userResetSecret': { name: 'userResetSecret'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userUpdate': { name: 'userUpdate'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; }; };
    'PreUser': { kind: 'OBJECT'; name: 'PreUser'; fields: { 'email': { name: 'email'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'cmsPage': { name: 'cmsPage'; type: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; } }; 'cmsPageFromSlug': { name: 'cmsPageFromSlug'; type: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; } }; 'cmsPages': { name: 'cmsPages'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'CMSPage'; ofType: null; }; }; } }; 'preUser': { name: 'preUser'; type: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; } }; 'preUserFromEmail': { name: 'preUserFromEmail'; type: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; } }; 'preUsers': { name: 'preUsers'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PreUser'; ofType: null; }; }; } }; 'user': { name: 'user'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userFromAuth': { name: 'userFromAuth'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userFromEmail': { name: 'userFromEmail'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'userSECURE': { name: 'userSECURE'; type: { kind: 'OBJECT'; name: 'UserSECURE'; ofType: null; } }; 'users': { name: 'users'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; }; } }; }; };
    'String': unknown;
    'TS': { kind: 'OBJECT'; name: 'TS'; fields: { 'created': { name: 'created'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; 'updated': { name: 'updated'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; }; };
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'credentials': { name: 'credentials'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'UserCredential'; ofType: null; }; }; } }; 'email': { name: 'email'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'firstName': { name: 'firstName'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'scope': { name: 'scope'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'UserScopeProp'; ofType: null; }; }; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TS'; ofType: null; }; } }; }; };
    'UserCredential': { kind: 'OBJECT'; name: 'UserCredential'; fields: { 'country': { name: 'country'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'createdAt': { name: 'createdAt'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'device': { name: 'device'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'lastUsedAt': { name: 'lastUsedAt'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'nickname': { name: 'nickname'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'userId': { name: 'userId'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
    'UserSECURE': { kind: 'OBJECT'; name: 'UserSECURE'; fields: { 'secret': { name: 'secret'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'user': { name: 'user'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; }; };
    'UserScopeProp': { name: 'UserScopeProp'; enumValues: 'EDIT' | 'ADMIN' | 'PHOTO_VOTE' | 'PHOTO_MANAGE'; };
  };
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}