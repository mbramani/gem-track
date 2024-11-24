import { addressRouter } from './address';
import { authRouter } from './auth';
import { clientRouter } from './client';
import { createTRPCRouter } from '../init';
import { diamondPacketRouter } from './diamond-packet';
import { employeeRouter } from './employee';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    user: userRouter,
    client: clientRouter,
    employee: employeeRouter,
    address: addressRouter,
    diamondPacket: diamondPacketRouter,
});

export type AppRouter = typeof appRouter;
