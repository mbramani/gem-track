'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { addressSchema, employeeSchema } from '@/schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const employeeCreateSchema = z.object({
    employee: employeeSchema,
    address: addressSchema,
});

type EmployeeCreateValues = z.infer<typeof employeeCreateSchema>;
type EmployeeEditValues = z.infer<typeof employeeSchema>;

export function EmployeeCreateForm() {
    const router = useRouter();

    const form = useForm<EmployeeCreateValues>({
        resolver: zodResolver(employeeCreateSchema),
        defaultValues: {
            employee: {
                name: '',
                email: '',
                phoneNo: '',
                employeeId: '',
                panNo: '',
            },
            address: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                country: '',
                postalCode: '',
            },
        },
    });

    const employeeCreateMutation = trpc.employee.create.useMutation({
        onSuccess: () => {
            toast({
                title: 'Employee created',
                description: 'Employee has been created successfully.',
            });
            router.push('/dashboard/employees');
        },
        onError: (error) => {
            toast({
                title: 'Error creating employee',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onSubmit(data: EmployeeCreateValues) {
        employeeCreateMutation.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <fieldset>
                        <legend className="text-lg font-semibold mb-4">
                            Employee Details
                        </legend>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="employee.employeeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="employee-id">
                                            Employee ID
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="employee-id"
                                                placeholder="Enter employee id"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employee.name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="employee-name">
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="employee-name"
                                                placeholder="Enter employee name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employee.email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="employee-email">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="employee-email"
                                                type="email"
                                                placeholder="Enter employee email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employee.phoneNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="employee-phoneNo">
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="employee-phoneNo"
                                                placeholder="Enter employee phone number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="employee.panNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="employee-panNo">
                                            PAN Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="employee-panNo"
                                                placeholder="Enter employee PAN number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend className="text-lg font-semibold mb-4">
                            Address Information
                        </legend>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="address.addressLine1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="addressLine1">
                                            Address Line 1
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="addressLine1"
                                                placeholder="Enter address line 1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address.addressLine2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="addressLine2">
                                            Address Line 2 (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="addressLine2"
                                                placeholder="Enter address line 2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="city">
                                            City
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="city"
                                                placeholder="Enter city"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address.state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="state">
                                            State
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="state"
                                                placeholder="Enter state"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address.country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="country">
                                            Country
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="country"
                                                placeholder="Enter country"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address.postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="postalCode">
                                            Postal Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="postalCode"
                                                placeholder="Enter postal code"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </fieldset>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        type="submit"
                        disabled={employeeCreateMutation.isPending}
                    >
                        {employeeCreateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Employee'
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export function EmployeeEditForm({ id }: { id: string }) {
    const router = useRouter();
    const [{ employee }] = trpc.employee.getById.useSuspenseQuery({ id });

    const updateEmployeeMutation = trpc.employee.update.useMutation({
        onError(error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSuccess(data) {
            toast({
                title: 'Employee updated',
                description: data.message,
            });
        },
    });

    const form = useForm<EmployeeEditValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: employee.name,
            email: employee?.email || '',
            phoneNo: employee.phoneNo,
            employeeId: employee.employeeId,
            panNo: employee.panNo,
        },
    });

    function onEmployeeFormSubmit(data: EmployeeEditValues) {
        updateEmployeeMutation.mutate({ ...data, id });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onEmployeeFormSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="employeeId">
                                Employee ID
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="employeeId"
                                    placeholder="Enter employee ID"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <FormControl>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="phoneNo">
                                Phone Number
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="phoneNo"
                                    placeholder="Enter phone number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="panNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="panNo">PAN Number</FormLabel>
                            <FormControl>
                                <Input
                                    id="panNo"
                                    placeholder="Enter PAN number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between">
                    <Button
                        type="submit"
                        disabled={updateEmployeeMutation.isPending}
                        aria-label="Update Employee"
                    >
                        {updateEmployeeMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Employee'
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
