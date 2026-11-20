import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';

// sync hook via module.registerHooks (node >=23.5), which intercepts
// require() as well as import — tsx compiles this module graph to CJS
registerHooks({
  load(url, context, nextLoad) {
    if (url.split('?')[0].endsWith('.graphql')) {
      const content = readFileSync(new URL(url), 'utf8');
      return {
        shortCircuit: true,
        // plain CJS works for both require() and import interop
        format: 'commonjs',
        source: `module.exports = ${JSON.stringify(content)}`,
      };
    }
    return nextLoad(url, context);
  },
});
