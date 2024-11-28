import {
    DiamondColor,
    DiamondPurity,
    DiamondShape,
    ProcessStatus,
} from '@prisma/client';

import { start } from 'repl';
import { z } from 'zod';

const GST_IN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
const PAN_NO_REGEX = /^[A-Z]{5}\d{4}[A-Z]$/;

export const idSchema = z.object({
    id: z.string().uuid({ message: 'Invalid UUID format' }),
});

export const timeStampSchema = z.object({
    createdAt: z.date({
        required_error: 'Created date is required',
        invalid_type_error: 'Created date must be a valid date',
    }),
    updatedAt: z.date({
        required_error: 'Updated date is required',
        invalid_type_error: 'Updated date must be a valid date',
    }),
});

export const userSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Name must be at least 3 characters long' })
        .max(100, { message: 'Name must be 100 or fewer characters long' }),
    email: z
        .string()
        .email({ message: 'Invalid email address' })
        .max(256, { message: 'Email must be 256 or fewer characters long' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(12, { message: 'Password must be 12 or fewer characters long' }),
    phoneNo: z
        .string()
        .min(10, {
            message: 'Phone number must be at least 10 characters long',
        })
        .max(15, {
            message: 'Phone number must be 15 or fewer characters long',
        }),
    gstInNo: z
        .string()
        .regex(GST_IN_REGEX, { message: 'Invalid GSTIN number' }),
});

export const loginSchema = userSchema.pick({ email: true, password: true });
export const profileSchema = userSchema.omit({ password: true });
export const addressSchema = z.object({
    addressLine1: z
        .string()
        .min(1, { message: 'Address Line 1 is required' })
        .max(1000, {
            message: 'Address Line 1 must be 1000 or fewer characters long',
        }),
    addressLine2: z
        .string()
        .max(1000, {
            message: 'Address Line 2 must be 1000 or fewer characters long',
        })
        .optional(),
    city: z
        .string()
        .min(1, { message: 'City is required' })
        .max(255, { message: 'City must be 255 or fewer characters long' }),
    state: z
        .string()
        .min(1, { message: 'State is required' })
        .max(255, { message: 'State must be 255 or fewer characters long' }),
    country: z
        .string()
        .min(1, { message: 'Country is required' })
        .max(255, { message: 'Country must be 255 or fewer characters long' }),
    postalCode: z.string().length(6, {
        message: 'Postal Code must be exactly 6 characters long',
    }),
});

export const clientSchema = profileSchema.merge(
    z.object({
        clientId: z.string().min(1, 'Client Id is required').max(255, {
            message: 'Client Id must be 255 or fewer characters long',
        }),
    })
);

export const employeeSchema = profileSchema
    .pick({ name: true, email: true, phoneNo: true })
    .merge(
        z.object({
            employeeId: z.string().min(1, 'Employee Id is required').max(255, {
                message: 'Employee Id must be 255 or fewer characters long',
            }),
            panNo: z
                .string()
                .regex(PAN_NO_REGEX, { message: 'Invalid Pan number' }),
        })
    );

export const diamondPacketSchema = z.object({
    diamondPacketId: z
        .string()
        .min(1, { message: 'Diamond Packet ID is required' })
        .max(255, {
            message: 'Diamond Packet ID must be 255 or fewer characters long',
        }),
    batchNo: z.number().multipleOf(0.01, {
        message: 'Batch number must be a multiple of 0.01',
    }),
    evNo: z
        .number()
        .int({ message: 'EV number must be an integer' })
        .optional(),
    packetNo: z.number().multipleOf(0.01, {
        message: 'Packet number must be a multiple of 0.01',
    }),
    lot: z.number().int({ message: 'Lot must be an integer' }),
    piece: z.number().int({ message: 'Piece must be an integer' }),
    makeableWeight: z
        .number()
        .multipleOf(0.0001)
        .positive({ message: 'Makeable weight must be positive' }),
    expectedWeight: z
        .number()
        .multipleOf(0.0001)
        .positive({ message: 'Expected weight must be positive' }),
    booterWeight: z
        .number()
        .multipleOf(0.0001)
        .positive({ message: 'Booter weight must be positive' }),
    diamondShape: z.nativeEnum(DiamondShape, {
        message: 'Diamond shape is invalid',
    }),
    diamondColor: z.nativeEnum(DiamondColor, {
        message: 'Diamond color is invalid',
    }),
    diamondPurity: z.nativeEnum(DiamondPurity, {
        message: 'Diamond purity is invalid',
    }),
    receiveDateTime: z.date({ message: 'Invalid receive date time' }),
    deliveryDateTime: z
        .date({ message: 'Invalid delivery date time' })
        .optional(),
    clientId: z.string().uuid({ message: 'Invalid client ID' }),
});

export const processSchema = z.object({
    processId: z
        .string()
        .min(1, { message: 'Process ID is required' })
        .max(255, {
            message: 'Process ID must be 255 or fewer characters long',
        }),
    name: z
        .string()
        .min(1, { message: 'Name is required' })
        .max(255, { message: 'Name must be 255 or fewer characters long' }),
    description: z
        .string()
        .max(1000, {
            message: 'Description must be 1000 or fewer characters long',
        })
        .optional(),
    price: z
        .number()
        .positive({ message: 'Price must be positive' })
        .multipleOf(0.0001, {
            message: 'Price must be a multiple of 0.0001',
        }),
    cost: z
        .number()
        .positive({ message: 'Cost must be positive' })
        .multipleOf(0.0001, {
            message: 'Cost must be a multiple of 0.0001',
        }),
});

export const diamondPacketProcessSchema = z.object({
    status: z
        .nativeEnum(ProcessStatus, { message: 'Process status is invalid' })
        .default(ProcessStatus.PENDING),
    startDateTime: z.date({ message: 'Invalid start date time' }),
    endDateTime: z.date({ message: 'Invalid end date time' }).optional(),
    beforeWeight: z
        .number()
        .multipleOf(0.0001)
        .positive({ message: 'After weight must be positive' }),
    afterWeight: z
        .number()
        .multipleOf(0.0001)
        .positive({ message: 'After weight must be positive' })
        .optional(),
    remarks: z
        .string()
        .max(1000, {
            message: 'Remarks must be 1000 or fewer characters long',
        })
        .optional(),
    processId: z.string().uuid({ message: 'Invalid process ID' }),
    diamondPacketId: z.string().uuid({ message: 'Invalid diamond packet ID' }),
    employeeId: z.string().uuid({ message: 'Invalid employee ID' }),
});

export const paginationSchema = z.object({
    page: z
        .number()
        .int({ message: 'Page must be an integer' })
        .positive({ message: 'Page must be positive' })
        .default(1),
    limit: z
        .number()
        .int({ message: 'Limit must be an integer' })
        .positive({ message: 'Limit must be positive' })
        .max(100, { message: 'Limit cannot exceed 100' })
        .default(10),
});

export const createSortSchema = <T extends z.ZodObject<z.ZodRawShape>>(
    schema: T
) => {
    const keys = Object.keys(schema.shape) as [string, ...string[]];
    return z
        .array(
            z.object({
                id: z.enum(keys),
                desc: z.boolean().default(false),
            })
        )
        .default([]);
};

export const createFilterSchema = <T extends z.ZodObject<z.ZodRawShape>>(
    schema: T
) => {
    const fieldNames = Object.keys(schema.shape) as [string, ...string[]];
    const filters = fieldNames.map((fieldName) => {
        const fieldSchema = schema.shape[fieldName];
        return z.object({
            id: z.enum([fieldName]),
            value: fieldSchema.optional(),
        });
    });

    return z
        .array(
            z.discriminatedUnion(
                'id',
                filters as [(typeof filters)[0], ...(typeof filters)[number][]]
            )
        )
        .default([]);
};
