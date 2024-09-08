import type { Module } from 'graphql-modules';

import BaseModule from './_base/module';
import UserModule from './User/module';
import UserSource from './User/source';
import PreUserModule from './PreUser/module';
import PreUserSource from './PreUser/source';
import CMSPageModule from './CMSPage/module';
import CMSPageSource from './CMSPage/source';
import CMSImageModule from './CMSImage/module';
import CMSImageSource from './CMSImage/source';
import CMSFileModule from './CMSFile/module';
import RoomModule from './Room/module';
import RoomSource from './Room/source';
import CabinModule from './Cabin/module';
import CabinSource from './Cabin/source';
import StayModule from './Stay/module';
import StaySource from './Stay/source';
import StayTokenModule from './StayToken/module';
import StayTokenSource from './StayToken/source';

// DEFINE SCHEMA

export const modules: Module[] = [
  BaseModule,
  // -----------
  UserModule,
  PreUserModule,
  CMSPageModule,
  CMSImageModule,
  CMSFileModule,
  RoomModule,
  CabinModule,
  StayModule,
  StayTokenModule,
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
  stay: new StaySource(),
  stayToken: new StayTokenSource(),
});
