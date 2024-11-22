import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';
import { profileSchema } from '@/schemas';

export const userRouter = createTRPCRouter({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        // Find user by id
        const user = await ctx.db.user.findFirst({
            where: { id: ctx.userId },
        });

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return { profile: userWithoutPassword };
    }),

    updateProfile: protectedProcedure
        .input(profileSchema)
        .mutation(async ({ ctx, input }) => {
            // Find user by id or email to check for email conflict
            const user = await ctx.db.user.findFirst({
                where: {
                    OR: [
                        { id: ctx.userId }, // Current user
                        { email: input.email }, // Email conflict check
                    ],
                },
            });

            // If user is not found or the email is already in use by another user
            if (
                !user ||
                (user.email === input.email && user.id !== ctx.userId)
            ) {
                throw new TRPCError({
                    code: user ? 'CONFLICT' : 'NOT_FOUND',
                    message: user ? 'Email already in use' : 'User not found',
                });
            }

            // Update user
            const updatedUser = await ctx.db.user.update({
                where: { id: ctx.userId },
                data: input,
            });

            if (!updatedUser) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found or access denied',
                });
            }

            return { message: 'User updated successfully' };
        }),
});
