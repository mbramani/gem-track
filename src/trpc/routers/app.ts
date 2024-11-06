import { createTRPCRouter, publicProcedure } from '../init';

import { authRouter } from './auth';

export const appRouter = createTRPCRouter({
    auth: authRouter,
});

export type AppRouter = typeof appRouter;
