import { addressSchema, idSchema } from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';

export const addressRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find address by id and user id
            const address = await ctx.db.address.findFirst({
                where: { id: input.id },
                include: { user: true, client: true, employee: true },
            });

            // Check if address exists and user has access
            if (
                !address ||
                !(
                    address.user?.id === ctx.userId ||
                    address.client?.userId === ctx.userId ||
                    address.employee?.userId === ctx.userId
                )
            ) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Address not found or access denied',
                });
            }

            return { address };
        }),

    update: protectedProcedure
        .input(addressSchema.merge(idSchema))
        .mutation(async ({ ctx, input }) => {
            // Extract id from input to avoid overwriting it
            const { id, ...updateData } = input;

            // Update address
            const updatedAddress = await ctx.db.address.update({
                where: {
                    id,
                    OR: [
                        { user: { id: ctx.userId } },
                        { client: { userId: ctx.userId } },
                        { employee: { userId: ctx.userId } },
                    ],
                },
                data: updateData,
            });

            // Check if address was updated
            if (!updatedAddress) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Address not found or access denied',
                });
            }

            return { message: 'Address updated successfully' };
        }),
});
