import { addressRouter } from './address';
import { authRouter } from './auth';
import { clientRouter } from './client';
import { createTRPCRouter } from '../init';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    user: userRouter,
    client: clientRouter,
    address: addressRouter,
});

export type AppRouter = typeof appRouter;
