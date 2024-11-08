import { createTRPCRouter, publicProcedure } from '../init';

import { addressRouter } from './address';
import { authRouter } from './auth';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    user: userRouter,
    address: addressRouter,
});

export type AppRouter = typeof appRouter;
