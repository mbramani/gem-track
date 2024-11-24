import {
    addressSchema,
    clientSchema,
    createFilterSchema,
    createSortSchema,
    idSchema,
    paginationSchema,
    timeStampSchema,
} from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const clientRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ client: clientSchema, address: addressSchema }))
        .mutation(async ({ ctx, input }) => {
            const { client, address } = input;
            // Check if clientId already exists
            const existingClient = await ctx.db.client.findFirst({
                where: { clientId: client.clientId, userId: ctx.userId },
            });

            if (existingClient) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Client ID already exists',
                });
            }

            // Create a new client and address
            const createdAddress = await ctx.db.address.create({
                data: {
                    ...address,
                    client: {
                        create: {
                            ...client,
                            userId: ctx.userId,
                        },
                    },
                },
                include: { client: true },
            });

            // Return the created client and address
            const { client: createdClient, ...createdAddressWithoutClient } =
                createdAddress;
            return {
                client: createdClient,
                address: createdAddressWithoutClient,
            };
        }),

    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find client by id and user id
            const client = await ctx.db.client.findFirst({
                where: { id: input.id, userId: ctx.userId },
            });

            if (!client) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client not found or access denied',
                });
            }

            return { client };
        }),

    getByClientId: protectedProcedure
        .input(clientSchema.pick({ clientId: true }))
        .query(async ({ ctx, input }) => {
            // Find client by client id and user id
            const client = await ctx.db.client.findFirst({
                where: { clientId: input.clientId, userId: ctx.userId },
                include: { address: true },
            });

            if (!client) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client not found or access denied',
                });
            }

            return { client };
        }),

    getClients: protectedProcedure
        .input(
            z.object({
                pagination: paginationSchema,
                sort: createSortSchema(
                    clientSchema.merge(
                        timeStampSchema.pick({ createdAt: true })
                    )
                ),
                filter: createFilterSchema(clientSchema),
            })
        )
        .query(async ({ ctx, input }) => {
            const { pagination, sort, filter } = input;
            const { page, limit } = pagination;

            // Process filters
            const filterConditions = filter
                .filter(({ value }) => value)
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

            // Find clients
            const clients = await ctx.db.client.findMany({
                where,
                orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            });

            // Count total clients
            const total = await ctx.db.client.count({ where });

            return {
                clients,
                pages: Math.ceil(total / limit),
                currentPage: page,
            };
        }),

    update: protectedProcedure
        .input(clientSchema.merge(idSchema))
        .mutation(async ({ ctx, input }) => {
            // Extract id from input to avoid overwriting it
            const { id, ...updateData } = input;

            // Check if clientId already exists
            const existingClient = await ctx.db.client.findFirst({
                where: { clientId: updateData.clientId, userId: ctx.userId },
            });

            if (existingClient && existingClient.id !== id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Client ID already exists',
                });
            }

            // Update client
            const updatedClient = await ctx.db.client.update({
                where: { id, userId: ctx.userId },
                data: updateData,
            });

            if (!updatedClient) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client not found or access denied',
                });
            }

            return { message: 'Client updated successfully' };
        }),

    delete: protectedProcedure
        .input(idSchema)
        .mutation(async ({ ctx, input }) => {
            // Delete client by id and user id
            const deletedClient = await ctx.db.client.delete({
                where: { id: input.id, userId: ctx.userId },
            });

            if (!deletedClient) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client not found or access denied',
                });
            }

            return { message: 'Client deleted successfully' };
        }),
});
