import { type Module, createApplication } from 'graphql-modules';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { type DocumentNode } from 'graphql';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { type YogaInitialContext, createYoga } from 'graphql-yoga';
import { type GraphResponseType } from './utilities';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context as AWSContext,
} from 'aws-lambda';

export type ExtendScopeOpts<T = never> =
  | (T extends never ? never : T)
  | '__SECURE' // secure context for internal access only
  | 'ADMIN';

export type ScopeObjectType<ScopeOpts extends string = string> = Partial<
  Record<ScopeOpts, boolean>
>;

export type ResolverContextType<
  SourcesType,
  ScopeOpts extends string = never
> = {
  sources: SourcesType;
  scope: ScopeObjectType<ExtendScopeOpts<ScopeOpts>>;
  userId: string | null;
};

export type ContextFnType<CtxType extends ResolverContextType<unknown>> = (
  scope: CtxType['scope'],
  userId?: string
) => CtxType;

/**
 * create executor functions for local and api queries
 */
export const createExecutors = <
  CtxType extends ResolverContextType<unknown>
>(p: {
  sources: () => CtxType['sources'];
  modules: Module[];
  secureScope: CtxType['scope'];
  auth: (
    ctx: YogaInitialContext,
    context: ContextFnType<CtxType>
  ) => Promise<ResolverContextType<any, any> | any[]>;
}) => {
  const modulesApp = createApplication({ modules: p.modules });
  const context = (scope: CtxType['scope'], userId?: string) =>
    ({
      sources: p.sources(),
      scope,
      userId: userId || null,
    } as CtxType);

  const execute = modulesApp.createExecution();
  const graphUntyped = (
    document: DocumentNode,
    variableValues?: { [key: string]: unknown }
  ) =>
    execute({
      schema: modulesApp.schema,
      document,
      variableValues,
      contextValue: context(p.secureScope, 'INTERNAL'),
    });

  const graph = <TResult, TVariables>(
    document: TypedDocumentNode<TResult, TVariables>,
    ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
  ) =>
    graphUntyped(
      document,
      variables || undefined
    ) as GraphResponseType<TResult>;

  const yoga = createYoga<AWSFullContextObject>({
    plugins: [useGraphQLModules(modulesApp)],
    graphqlEndpoint: '/gql',
    graphiql: false,
    context: (ctx) => {
      return p.auth(ctx, context);
    },
  });

  const graphHTTP: (
    event: APIGatewayProxyEventV2,
    context: AWSContext
  ) => Promise<APIGatewayProxyStructuredResultV2> = async (
    event,
    awsContext
  ) => {
    const response = await yoga.fetch(
      `https://${event.requestContext.domainName}${event.requestContext.http.path}?${event.rawQueryString}`,
      {
        method: event.requestContext.http.method,
        headers: event.headers as HeadersInit,
        body:
          event.body && event.isBase64Encoded
            ? Buffer.from(event.body, 'base64')
            : event.body,
      },
      { event, awsContext }
    );

    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body:
        typeof response.body === 'string'
          ? response.body
          : await response.text(),
      isBase64Encoded: false,
    };
  };

  return { graph, graphHTTP };
};

export type AWSFullContextObject = {
  event: APIGatewayProxyEventV2;
  awsContext: AWSContext;
};

// /**
//  * create context function based on passed sources and scope options.
//  * @example const context = createContext<ScopeOpts>()(sources);
//  */
// export const createContext =
//   <ScopeOpts extends string>() =>
//   <SourcesType>(sources: () => SourcesType) =>
//   (
//     scope: ScopeObjectType<ExtendScopeOpts<ScopeOpts>>,
//     userId?: string
//   ): ResolverContextType<SourcesType, ScopeOpts> => ({
//     sources: sources(),
//     scope,
//     userId: userId || null,
//   });
