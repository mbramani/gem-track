import { cache } from 'react';
import { cookies } from 'next/headers';
import { initTRPC } from '@trpc/server';
import { prisma } from '@/lib/prisma';
import superjson from 'superjson';
import { verifyJWT } from '@/lib/auth';

export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
    const cookieStore = await cookies();
    const token = cookieStore.get('session-token')?.value;
    const payload = token ? await verifyJWT(token) : null;

    return { userId: payload?.userId ?? null, db: prisma };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            message:
                error.code === 'INTERNAL_SERVER_ERROR'
                    ? 'An unexpected error occurred. Please try again later.'
                    : shape.message,
            data: {
                ...shape.data,
            },
        };
    },
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
