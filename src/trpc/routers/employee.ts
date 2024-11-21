import {
    addressSchema,
    createFilterSchema,
    createSortSchema,
    employeeSchema,
    idSchema,
    paginationSchema,
    timeStampSchema,
} from '@/schemas';
import { createTRPCRouter, protectedProcedure } from '../init';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const employeeRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ employee: employeeSchema, address: addressSchema }))
        .mutation(async ({ ctx, input }) => {
            const { employee, address } = input;
            // Create a new employee and address
            const createdAddress = await ctx.db.address.create({
                data: {
                    ...address,
                    employee: {
                        create: {
                            ...employee,
                            userId: ctx.userId,
                        },
                    },
                },
                include: { employee: true },
            });

            // Return the created employee and address
            const {
                employee: createdEmployee,
                ...createdAddressWithoutEmployee
            } = createdAddress;
            return {
                employee: createdEmployee,
                address: createdAddressWithoutEmployee,
            };
        }),

    getById: protectedProcedure
        .input(idSchema)
        .query(async ({ ctx, input }) => {
            // Find employee by id and user id
            const employee = await ctx.db.employee.findFirst({
                where: { id: input.id, userId: ctx.userId },
                include: { address: true },
            });

            if (!employee) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client not found or access denied',
                });
            }

            return { employee };
        }),

    getByEmployeeId: protectedProcedure
        .input(employeeSchema.pick({ employeeId: true }))
        .query(async ({ ctx, input }) => {
            // Find employee by employee id and user id
            const employee = await ctx.db.employee.findFirst({
                where: { employeeId: input.employeeId, userId: ctx.userId },
                include: { address: true },
            });

            if (!employee) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Employee not found or access denied',
                });
            }

            return { employee };
        }),

    getEmployees: protectedProcedure
        .input(
            z.object({
                pagination: paginationSchema,
                sort: createSortSchema(
                    employeeSchema.merge(
                        timeStampSchema.pick({ createdAt: true })
                    )
                ),
                filter: createFilterSchema(employeeSchema),
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

            // Fetch data
            const employees = await ctx.db.employee.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            });

            const total = await ctx.db.employee.count({ where });

            return {
                employees,
                pages: Math.ceil(total / limit),
                currentPage: page,
            };
        }),

    update: protectedProcedure
        .input(employeeSchema.merge(idSchema))
        .mutation(async ({ ctx, input }) => {
            // Extract id from input to avoid overwriting it
            const { id, ...updateData } = input;

            // Update employee
            const updatedEmployee = await ctx.db.employee.updateMany({
                where: { id, userId: ctx.userId },
                data: updateData,
            });

            if (updatedEmployee.count === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Employee not found or access denied',
                });
            }

            return { message: 'Employee updated successfully' };
        }),

    delete: protectedProcedure
        .input(idSchema)
        .mutation(async ({ ctx, input }) => {
            // Delete employee by id and user id
            const deletedEmployee = await ctx.db.employee.deleteMany({
                where: { id: input.id, userId: ctx.userId },
            });

            if (deletedEmployee.count === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Employee not found or access denied',
                });
            }

            return { message: 'Employee deleted successfully' };
        }),
});
