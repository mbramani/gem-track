import { TRPCError, initTRPC } from '@trpc/server';

import { ZodError } from 'zod';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import superjson from 'superjson';
import { verifyJWT } from '@/lib/auth';

export const createTRPCContext = cache(async () => {
    return { db: prisma };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        console.log(error);
        return {
            ...shape,
            message:
                error.code === 'INTERNAL_SERVER_ERROR'
                    ? 'An unexpected error occurred. Please try again later.'
                    : shape.message,
            data: {
                ...shape.data,
                zodError:
                    error.code === 'BAD_REQUEST' &&
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('session-token')?.value;
    if (!token) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }

    const payload = await verifyJWT(token);
    const userId = payload?.userId as string;
    if (!userId) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid authentication token',
        });
    }

    return next({ ctx: { userId } });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
