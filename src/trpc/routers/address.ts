import { addressSchema, idSchema } from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';

export const addressRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find address by id and user id
            const address = await ctx.db.address.findFirst({
                where: { id: input.id, User: { id: ctx.userId } },
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
            // Find address by id and user id
            const address = await ctx.db.address.findFirst({
                where: { id: input.id, User: { id: ctx.userId } },
            });

            if (!address) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Address not found or access denied',
                });
            }

            // Extract id from input to avoid overwriting it
            const { id, ...updateData } = input;

            // Update address
            const updatedAddress = await ctx.db.address.update({
                where: { id },
                data: updateData,
            });

            return { address: updatedAddress };
        }),
});
