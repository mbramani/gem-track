import { comparePassword, createJWT } from '@/lib/auth';
import { createTRPCRouter, publicProcedure } from '../init';

import { TRPCError } from '@trpc/server';
import { cookies } from 'next/headers';
import { loginSchema } from '@/schemas';

export const authRouter = createTRPCRouter({
    login: publicProcedure
        .input(loginSchema)
        .mutation(async ({ ctx, input }) => {
            // Find user by email
            const user = await ctx.db.user.findFirst({
                where: { email: input.email },
            });
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'No user found with this email address',
                });
            }

            // Check password
            const isValidPassword = await comparePassword(
                input.password,
                user.password
            );
            if (!isValidPassword) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'The password is incorrect',
                });
            }

            // Create JWT token
            const token = await createJWT({ userId: user.id });

            // Set cookie
            const cookieStore = await cookies();
            cookieStore.set('session-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            return { message: 'Login successful' };
        }),
});
