import { DiamondColor, DiamondPurity, DiamondShape } from '@prisma/client';
import {
    createFilterSchema,
    createSortSchema,
    diamondPacketSchema,
    idSchema,
    paginationSchema,
    timeStampSchema,
} from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const diamondPacketRouter = createTRPCRouter({
    create: protectedProcedure
        .input(diamondPacketSchema)
        .mutation(async ({ ctx, input }) => {
            // Create a new diamond packet
            const diamondPacket = await ctx.db.diamondPacket.create({
                data: {
                    ...input,
                    size: input.makeableWeight / (input?.piece || 1),
                    expectedPercentage:
                        (input.makeableWeight / input.expectedWeight) * 100,
                    clientId: input.clientId,
                    userId: ctx.userId,
                },
            });

            return { diamondPacket };
        }),

    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find diamond packet by id and user id
            const diamondPacket = await ctx.db.diamondPacket.findFirst({
                where: { id: input.id, userId: ctx.userId },
                include: { client: true },
            });

            if (!diamondPacket) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Diamond packet not found or access denied',
                });
            }

            return { diamondPacket };
        }),

    getDiamondPackets: protectedProcedure
        .input(
            z.object({
                pagination: paginationSchema,
                sort: createSortSchema(
                    diamondPacketSchema.merge(
                        timeStampSchema.pick({ createdAt: true })
                    )
                ),
                filter: createFilterSchema(diamondPacketSchema),
            })
        )
        .query(async ({ ctx, input }) => {
            const { pagination, sort, filter } = input;
            const { page, limit } = pagination;

            // Process filters
            const filterConditions = filter
                .filter(
                    ({ value }) =>
                        value !== undefined && value !== null && value !== ''
                )
                .map(({ id, value }) => {
                    if (
                        typeof value === 'number' ||
                        Object.values(DiamondColor).includes(value) ||
                        Object.values(DiamondPurity).includes(value) ||
                        Object.values(DiamondShape).includes(value)
                    ) {
                        return { [id]: { equals: value } };
                    }
                    return { [id]: { contains: value, mode: 'insensitive' } };
                });

            const where = {
                userId: ctx.userId,
                AND: filterConditions.length > 0 ? filterConditions : undefined,
            };

            // Process sorting
            const orderBy = sort.map(({ id, desc }) => ({
                [id]: desc ? 'desc' : 'asc',
            }));

            // Find diamond packets
            const diamondPackets = await ctx.db.diamondPacket.findMany({
                where,
                orderBy: orderBy.length > 0 ? orderBy : [{ updatedAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            });

            // Count total diamond packets
            const total = await ctx.db.diamondPacket.count({ where });

            return {
                diamondPackets,
                pages: Math.ceil(total / limit),
                currentPage: page,
            };
        }),

    update: protectedProcedure
        .input(diamondPacketSchema.merge(idSchema))
        .mutation(async ({ ctx, input }) => {
            // Extract id from input to avoid overwriting it
            const { id, ...data } = input;

            // Update diamond packet
            const updatedDiamondPacket = await ctx.db.diamondPacket.update({
                where: { id, userId: ctx.userId },
                data,
            });

            if (!updatedDiamondPacket) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Diamond packet not found or access denied',
                });
            }

            return { message: 'Diamond packet updated successfully' };
        }),

    delete: protectedProcedure
        .input(idSchema)
        .mutation(async ({ ctx, input }) => {
            // Delete diamond packet by id and user id
            const deletedDiamondPacket = await ctx.db.diamondPacket.delete({
                where: { id: input.id, userId: ctx.userId },
            });

            if (!deletedDiamondPacket) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Diamond packet not found or access denied',
                });
            }

            return { message: 'Diamond packet deleted successfully' };
        }),
});
