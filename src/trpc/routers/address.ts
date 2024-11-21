import { addressSchema, idSchema } from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';

export const addressRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find address by id and user id
            const address = await ctx.db.address.findFirst({
                where: { id: input.id, user: { id: ctx.userId } },
            });

            if (!address) {
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
            const updatedAddress = await ctx.db.address.updateMany({
                where: { id, user: { id: ctx.userId } },
                data: updateData,
            });

            if (updatedAddress.count === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Address not found or access denied',
                });
            }

            return { message: 'Address updated successfully' };
        }),
});
