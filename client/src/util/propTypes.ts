import { ReactNode } from 'react';

export type Children = {
  children?: ReactNode;
};

export type SearchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export type PageParams = {
  params: { [key: string]: string };
};
export type PageArrayParams = {
  params: { [key: string]: string[] };
};
export type PageArrayOptParams = {
  params: { [key: string]: string[] | undefined };
};

export type Key = {
  key?: React.Key;
};

export type ComponentProps<T extends (...args: any) => any> = Parameters<T>[0];
