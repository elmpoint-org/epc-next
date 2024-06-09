import Cookies from 'js-cookie';

export type CookieOpts =
  | 'EPC'
  //------------//
  | 'USER_AUTH';

const cookies = {
  ...Cookies,
  set: (name: CookieOpts, value: string, opts?: Cookies.CookieAttributes) =>
    Cookies.set(name, value, opts),
  get: (name?: CookieOpts) => (name ? Cookies.get(name) : Cookies.get()),
  remove: (name: CookieOpts, opts?: Cookies.CookieAttributes) =>
    Cookies.remove(name, opts),
};

export default cookies;
