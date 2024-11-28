'use client';

import {
    DiamondPacketProcess,
    Employee,
    Process,
    ProcessStatus,
} from '@prisma/client';
import {
    EmployeeSearchPopover,
    ProcessSearchPopover,
} from '../ui/search-popover';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { diamondPacketProcessSchema } from '@/schemas';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type AssignedPacketFormValues = z.infer<typeof diamondPacketProcessSchema>;

interface AssignedPacketFormProps {
    initialValues?: DiamondPacketProcess & { employee?: Employee } & {
        process?: Process;
    };
    diamondPacketId: string;
    type?: 'assign' | 'update';
}

export function AssignedPacketForm({
    initialValues,
    diamondPacketId,
    type = 'assign',
}: AssignedPacketFormProps) {
    const router = useRouter();
    const isEditing = type === 'update';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AssignedPacketFormValues>({
        resolver: zodResolver(diamondPacketProcessSchema),
        defaultValues: {
            status: initialValues?.status || ProcessStatus.PENDING,
            startDateTime: initialValues?.startDateTime
                ? new Date(initialValues.startDateTime)
                : new Date(),
            endDateTime: initialValues?.endDateTime
                ? new Date(initialValues.endDateTime)
                : undefined,
            beforeWeight: Number(initialValues?.beforeWeight) || 0,
            afterWeight: Number(initialValues?.afterWeight) || undefined,
            remarks: initialValues?.remarks || '',
            processId: initialValues?.processId || '',
            diamondPacketId: diamondPacketId,
            employeeId: initialValues?.employeeId || '',
        },
    });

    const assignPacketMutation = trpc.diamondPacket.assignProcess.useMutation({
        onSuccess: () => {
            toast({
                title: 'Process assigned',
                description:
                    'The diamond packet has been assigned for processing.',
            });
            router.push(`/dashboard/diamond-packets/${diamondPacketId}`);
        },
        onError: (error) => {
            toast({
                title: 'Error assigning process',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const updateAssignedPacketMutation =
        trpc.diamondPacket.updateAssignedProcess.useMutation({
            onSuccess: () => {
                toast({
                    title: 'Assigned process updated',
                    description: 'The assigned process has been updated.',
                });
                router.push(`/dashboard/diamond-packets/${diamondPacketId}`);
            },
            onError: (error) => {
                toast({
                    title: 'Error updating assigned process',
                    description: error.message,
                    variant: 'destructive',
                });
            },
        });

    function onSubmit(data: AssignedPacketFormValues) {
        setIsSubmitting(true);
        if (isEditing) {
            updateAssignedPacketMutation.mutate({
                ...data,
                id: initialValues!.id,
            });
        } else {
            assignPacketMutation.mutate(data);
        }
        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(ProcessStatus).map(
                                            (status) => (
                                                <SelectItem
                                                    key={status}
                                                    value={status}
                                                    className="cursor-pointer"
                                                >
                                                    {status}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>Start Date and Time</FormLabel>
                                <FormControl>
                                    <DateTimePicker
                                        date={field.value}
                                        onDateChange={(date) =>
                                            field.onChange(date)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>End Date and Time</FormLabel>
                                <FormControl>
                                    <DateTimePicker
                                        date={field.value}
                                        onDateChange={(date) =>
                                            field.onChange(date)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="beforeWeight"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>Before Weight (ct)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="afterWeight"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>After Weight (ct)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : undefined
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="processId"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>Process</FormLabel>
                                <ProcessSearchPopover
                                    onProcessSelect={(processId) =>
                                        form.setValue('processId', processId)
                                    }
                                    selectedProcessId={field.value}
                                    defaultSelectedProcess={
                                        initialValues?.process
                                    }
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>Employee</FormLabel>
                                <EmployeeSearchPopover
                                    onEmployeeSelect={(employeeId) =>
                                        form.setValue('employeeId', employeeId)
                                    }
                                    selectedEmployeeId={field.value}
                                    defaultSelectedEmployee={
                                        initialValues?.employee
                                    }
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>Remarks</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-between px-0">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEditing ? 'Updating...' : 'Assigning...'}
                            </>
                        ) : isEditing ? (
                            'Update Assignment'
                        ) : (
                            'Assign Process'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
