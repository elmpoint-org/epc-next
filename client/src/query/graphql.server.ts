import { getServerAuth } from '@/app/_ctx/user/provider';
import { GQL, graph } from './graphql';

export const graphAuthServer = <R, V>(...[d, v]: GQL<R, V, {}>) =>
  graph.request(d, v ?? undefined, {
    authorization: getServerAuth(),
  });
