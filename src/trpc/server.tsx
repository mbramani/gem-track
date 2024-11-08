import 'server-only';

import { createCallerFactory, createTRPCContext } from './init';

import { appRouter } from './routers/app';
import { cache } from 'react';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { makeQueryClient } from './query-client';

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createTRPCContext);
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
    caller,
    getQueryClient
);
