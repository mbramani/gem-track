import { addressRouter } from './address';
import { authRouter } from './auth';
import { clientRouter } from './client';
import { createTRPCRouter } from '../init';
import { diamondPacketRouter } from './diamond-packet';
import { employeeRouter } from './employee';
import { processRouter } from './process';
import { reportRouter } from './report';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
    address: addressRouter,
    auth: authRouter,
    client: clientRouter,
    diamondPacket: diamondPacketRouter,
    employee: employeeRouter,
    process: processRouter,
    report: reportRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
