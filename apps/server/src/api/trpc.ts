import { TRPCError, initTRPC } from '@trpc/server';
import { type CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const createTrpcContext = (
  ctx: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>
) => ctx;
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
