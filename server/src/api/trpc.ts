import { TRPCError, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

export const createTrpcContext = (ctx: CreateExpressContextOptions) => ctx;
export type TrpcContext = Awaited<ReturnType<typeof createTrpcContext>>;

export const err = (
  status: TRPC_ERROR_CODE_KEY,
  message?: string,
  log?: unknown
) => {
  if (typeof log !== 'undefined') console.log(log);
  return new TRPCError({ code: status, cause: message });
};

export const t = initTRPC.context<TrpcContext>().create();
