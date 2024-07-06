import type { Module } from 'graphql-modules';

import BaseModule from './_base/module';
import UserModule from './User/module';
import UserSource from './User/source';
import PreUserModule from './PreUser/module';
import PreUserSource from './PreUser/source';
import CMSPageModule from './CMSPage/module';
import CMSPageSource from './CMSPage/source';
import CmsImageModule from './CMSImage/module';
import CMSImageSource from './CMSImage/source';

// DEFINE SCHEMA

export const modules: Module[] = [
  BaseModule,
  // -----------
  UserModule,
  PreUserModule,
  CMSPageModule,
  CmsImageModule,
];

export const sources = () => ({
  user: new UserSource(),
  preUser: new PreUserSource(),
  cms: {
    page: new CMSPageSource(),
    image: new CMSImageSource(),
  },
});
