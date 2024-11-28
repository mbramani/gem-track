import {
    DiamondColor,
    DiamondPurity,
    DiamondShape,
    ProcessStatus,
} from '@prisma/client';
import {
    createFilterSchema,
    createSortSchema,
    diamondPacketProcessSchema,
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
                include: { client: true, diamondPacketProcesses: true },
            });

            if (!diamondPacket) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Diamond packet not found or access denied',
                });
            }

            // Calculate final weight and percentage
            const lastAppliedProcess =
                diamondPacket.diamondPacketProcesses
                    .sort(
                        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                    )
                    .filter((ap) => ap.status === ProcessStatus.COMPLETED)[0] ??
                null;

            const finalWeight = lastAppliedProcess?.afterWeight ?? 0;
            const finalPercentage =
                finalWeight && diamondPacket.expectedWeight
                    ? (Number(finalWeight) /
                          Number(diamondPacket.expectedWeight)) *
                      100
                    : 0;

            return {
                diamondPacket: {
                    ...diamondPacket,
                    finalWeight,
                    finalPercentage,
                },
            };
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

    assignProcess: protectedProcedure
        .input(diamondPacketProcessSchema)
        .mutation(async ({ ctx, input }) => {
            // Assign diamond packet to a process
            await ctx.db.diamondPacketProcess.create({
                data: {
                    ...input,
                    userId: ctx.userId,
                },
            });

            return {
                message: 'Diamond packet assigned to process successfully',
            };
        }),

    getAssignedProcesses: protectedProcedure
        .input(
            z.object({
                pagination: paginationSchema,
                sort: createSortSchema(
                    diamondPacketProcessSchema.merge(
                        timeStampSchema.pick({ createdAt: true })
                    )
                ),
                filter: createFilterSchema(diamondPacketProcessSchema),
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
                        Object.values(ProcessStatus).includes(value)
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

            // Find assigned processes
            const assignedProcesses =
                await ctx.db.diamondPacketProcess.findMany({
                    where,
                    include: { employee: true, process: true },
                    orderBy:
                        orderBy.length > 0 ? orderBy : [{ updatedAt: 'desc' }],
                    skip: (page - 1) * limit,
                    take: limit,
                });

            // Count total assigned processes
            const total = await ctx.db.diamondPacketProcess.count({ where });

            return {
                assignedProcesses,
                pages: Math.ceil(total / limit),
                currentPage: page,
            };
        }),

    getAssignedProcessById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find assigned process by id and user id
            const assignedProcess = await ctx.db.diamondPacketProcess.findFirst(
                {
                    where: { id: input.id, userId: ctx.userId },
                    include: { process: true, employee: true },
                }
            );

            if (!assignedProcess) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Assigned process not found or access denied',
                });
            }

            return { assignedProcess };
        }),

    updateAssignedProcess: protectedProcedure
        .input(diamondPacketProcessSchema.merge(idSchema))
        .mutation(async ({ ctx, input }) => {
            // Destructure ID and other properties from input
            const { id, diamondPacketId, ...data } = input;

            // Update assigned process
            const updatedAssignedProcess =
                await ctx.db.diamondPacketProcess.update({
                    where: { id, userId: ctx.userId },
                    data,
                });

            if (!updatedAssignedProcess) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Assigned process not found or access denied',
                });
            }

            return { message: 'Assigned process updated successfully' };
        }),

    deleteAssignedProcess: protectedProcedure
        .input(idSchema)
        .mutation(async ({ ctx, input }) => {
            // Delete assigned process by id and user id
            const deletedAssignedProcess =
                await ctx.db.diamondPacketProcess.delete({
                    where: { id: input.id, userId: ctx.userId },
                });

            if (!deletedAssignedProcess) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Assigned process not found or access denied',
                });
            }

            return { message: 'Assigned process deleted successfully' };
        }),
});
