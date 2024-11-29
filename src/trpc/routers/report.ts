import {
    clientSchema,
    createFilterSchema,
    createSortSchema,
    idSchema,
    paginationSchema,
    reportSchema,
    timeStampSchema,
} from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const reportRouter = createTRPCRouter({
    create: protectedProcedure
        .input(reportSchema)
        .mutation(async ({ ctx, input }) => {
            const { diamondPacketIds, ...data } = input;
            // Check if reportId already exists
            const existingReport = await ctx.db.report.findFirst({
                where: { reportId: input.reportId, userId: ctx.userId },
            });

            if (existingReport) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Report ID already exists',
                });
            }

            // Validate diamond packets exist and user has access
            const diamondPackets = await ctx.db.diamondPacket.findMany({
                where: {
                    id: { in: diamondPacketIds },

                    userId: ctx.userId,
                },
                select: { id: true },
            });

            if (diamondPackets.length === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        'One or more diamond packets not found or access denied',
                });
            }
            // Create a new report
            const report = await ctx.db.report.create({
                data: {
                    ...data,
                    userId: ctx.userId,
                    reportItems: {
                        createMany: {
                            data: diamondPackets.map((dp) => ({
                                diamondPacketId: dp.id,
                            })),
                        },
                    },
                },
            });

            return { report };
        }),

    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find Report by id and user id
            const report = await ctx.db.report.findFirst({
                where: { id: input.id, userId: ctx.userId },
                include: {
                    reportItems: {
                        include: {
                            diamondPacket: {
                                include: {
                                    diamondPacketProcesses: {
                                        where: {
                                            status: 'COMPLETED',
                                        },
                                        orderBy: {
                                            startDateTime: 'desc',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    client: true,
                },
            });

            if (!report) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Report packet not found or access denied',
                });
            }

            // Calculate statistics for each diamond packet
            const reportItemsWithStats = report.reportItems.map((item) => {
                const dp = item.diamondPacket;
                const lastCompletedProcess = dp.diamondPacketProcesses[0];
                const finalWeight =
                    lastCompletedProcess?.afterWeight || dp.makeableWeight;
                const finalPercentage =
                    finalWeight && dp.expectedWeight
                        ? (Number(finalWeight) / Number(dp.expectedWeight)) *
                          100
                        : 0;

                return {
                    ...dp,
                    reportItemId: item.id,
                    id: undefined,
                    finalWeight,
                    finalPercentage,
                };
            });

            // Calculate totals
            const totals = reportItemsWithStats.reduce(
                (acc, item) => {
                    const dp = item;
                    return {
                        totalLot: acc.totalLot + (dp.lot || 0),
                        totalPiece: acc.totalPiece + (dp.piece || 0),
                        totalMakeableWeight:
                            acc.totalMakeableWeight + Number(dp.makeableWeight),
                        totalExpectedWeight:
                            acc.totalExpectedWeight + Number(dp.expectedWeight),
                        totalFinalWeight:
                            acc.totalFinalWeight + Number(item.finalWeight),
                    };
                },
                {
                    totalLot: 0,
                    totalPiece: 0,
                    totalMakeableWeight: 0,
                    totalExpectedWeight: 0,
                    totalFinalWeight: 0,
                }
            );

            return {
                report: {
                    ...report,
                    reportItems: reportItemsWithStats,
                    statistics: totals,
                },
            };
        }),

    getReports: protectedProcedure
        .input(
            z.object({
                pagination: paginationSchema,
                sort: createSortSchema(
                    reportSchema
                        .pick({ reportId: true })
                        .merge(timeStampSchema.pick({ createdAt: true }))
                ),
                filter: createFilterSchema(reportSchema),
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
                .map(({ id, value }) => ({
                    [id]: { contains: value, mode: 'insensitive' },
                }));

            const where = {
                userId: ctx.userId,
                AND: filterConditions.length > 0 ? filterConditions : undefined,
            };

            // Process sorting
            const orderBy = sort.map(({ id, desc }) => ({
                [id]: desc ? 'desc' : 'asc',
            }));

            // Find reports
            const reports = await ctx.db.report.findMany({
                where,
                include: { client: true },
                orderBy: orderBy.length > 0 ? orderBy : [{ updatedAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            });

            // Count total reports
            const total = await ctx.db.report.count({ where });

            return {
                reports,
                pages: Math.ceil(total / limit),
                currentPage: page,
            };
        }),

    delete: protectedProcedure
        .input(idSchema)
        .mutation(async ({ ctx, input }) => {
            // Delete report by id and user id
            const deletedReport = await ctx.db.report.delete({
                where: { id: input.id, userId: ctx.userId },
            });

            if (!deletedReport) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Report not found or access denied',
                });
            }

            return { message: 'Report deleted successfully' };
        }),
});
