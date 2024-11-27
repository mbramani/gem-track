import {
    createFilterSchema,
    createSortSchema,
    idSchema,
    paginationSchema,
    processSchema,
    timeStampSchema,
} from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const processRouter = createTRPCRouter({
    create: protectedProcedure
        .input(processSchema)
        .mutation(async ({ ctx, input }) => {
            // Check if processId already exists
            const existingProcess = await ctx.db.process.findFirst({
                where: { processId: input.processId, userId: ctx.userId },
            });

            if (existingProcess) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Process ID already exists',
                });
            }

            // Create a new process
            const process = await ctx.db.process.create({
                data: {
                    ...input,
                    userId: ctx.userId,
                },
            });

            return { process };
        }),

    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find process by id and user id
            const process = await ctx.db.process.findFirst({
                where: { id: input.id, userId: ctx.userId },
            });

            if (!process) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Process not found or access denied',
                });
            }

            return { process };
        }),

    getProcesses: protectedProcedure
        .input(
            z.object({
                pagination: paginationSchema,
                sort: createSortSchema(
                    processSchema.merge(
                        timeStampSchema.pick({ createdAt: true })
                    )
                ),
                filter: createFilterSchema(processSchema),
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
                    return typeof value === 'number'
                        ? { [id]: { equals: value } }
                        : { [id]: { contains: value, mode: 'insensitive' } };
                });

            const where = {
                userId: ctx.userId,
                AND: filterConditions.length > 0 ? filterConditions : undefined,
            };

            // Process sorting
            const orderBy = sort.map(({ id, desc }) => ({
                [id]: desc ? 'desc' : 'asc',
            }));

            // Find processes
            const processes = await ctx.db.process.findMany({
                where,
                orderBy: orderBy.length > 0 ? orderBy : [{ updatedAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            });

            // Count total process
            const total = await ctx.db.process.count({ where });

            return {
                processes,
                pages: Math.ceil(total / limit),
                currentPage: page,
            };
        }),

    update: protectedProcedure
        .input(processSchema.merge(idSchema))
        .mutation(async ({ ctx, input }) => {
            // Extract id from input to avoid overwriting it
            const { id, ...data } = input;

            // Check if processId already exists
            const existingProcess = await ctx.db.process.findFirst({
                where: { processId: data.processId, userId: ctx.userId },
            });

            if (existingProcess && existingProcess.id !== id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Process ID already exists',
                });
            }

            // Update process
            const updatedProcess = await ctx.db.process.update({
                where: { id, userId: ctx.userId },
                data,
            });

            if (!updatedProcess) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Process not found or access denied',
                });
            }

            return { message: 'Process updated successfully' };
        }),

    delete: protectedProcedure
        .input(idSchema)
        .mutation(async ({ ctx, input }) => {
            // Delete process by id and user id
            const deletedProcess = await ctx.db.process.delete({
                where: { id: input.id, userId: ctx.userId },
            });

            if (!deletedProcess) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Process not found or access denied',
                });
            }

            return { message: 'Process deleted successfully' };
        }),
});
