import { getServerAuth } from '@/app/_ctx/user/provider';
import { type GQL, type GraphAuthErrors, graph } from './graphql';
import type { Inside } from '@/util/inferTypes';
import type { GraphQLResponse } from 'graphql-request';

export const oldGraphAuthServer = async <R, V>(...[d, v]: GQL<R, V, {}>) =>
  graph.request(d, v ?? undefined, {
    authorization: await getServerAuth(),
  });

export async function graphAuthServer<R, V>(...[d, v]: GQL<R, V, {}>) {
  let errors: GraphAuthErrors | null = null;

  const data = await graph
    .request(d, v ?? undefined, {
      authorization: await getServerAuth(),
    })
    .catch((e) => {
      const errs = (e?.response as GraphQLResponse)?.errors;

      const parsed = errs?.map((e) => {
        const out: Inside<typeof errors> = {
          code: null,
          error: e,
        };

        const code = e?.extensions?.code;
        if (typeof code === 'string') out.code = code;
        return out;
      });

      errors = parsed ?? null;
      return undefined;
    });

  errors = errors as GraphAuthErrors | null;

  return { errors, data };
}
