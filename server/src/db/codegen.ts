import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: ['./src/db/models/**/*.graphql.ts'],
  generates: {
    './src/db/models/': {
      preset: 'graphql-modules',
      presetConfig: {
        baseTypesPath: '../__types/graphql-types.ts',
        filename: '__types/module-types.ts',
      },
      plugins: [
        { add: { content: '/* eslint-disable */' } },
        'typescript',
        'typescript-resolvers',
      ],
      config: {
        contextType: '../graph#ResolverContext',
        allowParentTypeOverride: true,
        scalars: {},
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
