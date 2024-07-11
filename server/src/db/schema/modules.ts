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
import RoomModule from './Room/module';
import RoomSource from './Room/source';
import CabinModule from './Cabin/module';
import CabinSource from './Cabin/source';

// DEFINE SCHEMA

export const modules: Module[] = [
  BaseModule,
  // -----------
  UserModule,
  PreUserModule,
  CMSPageModule,
  CmsImageModule,
  RoomModule,
  CabinModule,
];

export const sources = () => ({
  user: new UserSource(),
  preUser: new PreUserSource(),
  cms: {
    page: new CMSPageSource(),
    image: new CMSImageSource(),
  },
  room: new RoomSource(),
  cabin: new CabinSource(),
});
