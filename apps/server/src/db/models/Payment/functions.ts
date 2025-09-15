import { ResolverContext } from '##/db/graph.js';
import { getTypedScopeFunctions, handle as h } from '##/db/lib/utilities.js';
import { PaymentModule as M } from './__types/module-types';

const { scoped } = getTypedScopeFunctions<ResolverContext>();
