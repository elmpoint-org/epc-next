import type { Module } from 'graphql-modules';

import BaseModule from './_base/module';
import UserModule from './User/module';
import UserSource from './User/source';

// DEFINE SCHEMA

export const modules: Module[] = [
  BaseModule,
  // -----------
  UserModule,
];

export const sources = () => ({
  user: new UserSource(),
});
