'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { addressSchema, clientSchema } from '@/schemas';

import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const clientCreateSchema = z.object({
    client: clientSchema,
    address: addressSchema,
});

type ClientCreateValues = z.infer<typeof clientCreateSchema>;

type ClientEditValues = z.infer<typeof clientSchema>;

export function ClientCreateForm() {
    const router = useRouter();

    const form = useForm<ClientCreateValues>({
        resolver: zodResolver(clientCreateSchema),
        defaultValues: {
            client: {
                name: '',
                email: '',
                phoneNo: '',
                gstInNo: '',
                clientId: '',
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

    const clientCreateMutation = trpc.client.create.useMutation({
        onSuccess: () => {
            toast({
                title: 'Client created',
                description: 'Client has been created successfully.',
            });
            router.push('/dashboard/clients');
        },
        onError: (error) => {
            toast({
                title: 'Error creating client',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onSubmit(data: ClientCreateValues) {
        clientCreateMutation.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <fieldset>
                        <legend className="text-lg font-semibold mb-4">
                            Client Details
                        </legend>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="client.clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="client-id">
                                            Client ID
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="client-id"
                                                placeholder="Enter client ID"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="client.name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="client-name">
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="client-name"
                                                placeholder="Enter client name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="client.email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="client-email">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="client-email"
                                                type="email"
                                                placeholder="Enter client email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="client.phoneNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="client-phone">
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="client-phone"
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
                                name="client.gstInNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="client-gstin">
                                            GSTIN Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="client-gstin"
                                                placeholder="Enter GSTIN number"
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
                                        <FormLabel htmlFor="address-line1">
                                            Address Line 1
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address-line1"
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
                                        <FormLabel htmlFor="address-line2">
                                            Address Line 2 (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address-line2"
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
                                        <FormLabel htmlFor="address-city">
                                            City
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address-city"
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
                                        <FormLabel htmlFor="address-state">
                                            State
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address-state"
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
                                        <FormLabel htmlFor="address-country">
                                            Country
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address-country"
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
                                        <FormLabel htmlFor="address-postal">
                                            Postal Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address-postal"
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
                <CardFooter className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={clientCreateMutation.isPending}
                    >
                        {clientCreateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Client'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
}

export function ClientEditForm({ id }: { id: string }) {
    const [{ client }] = trpc.client.getById.useSuspenseQuery({ id });

    const updateClientMutation = trpc.client.update.useMutation({
        onError(error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSuccess(data) {
            toast({
                title: 'Client updated',
                description: data.message,
            });
        },
    });

    const form = useForm<ClientEditValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            clientId: client.clientId,
            name: client.name,
            email: client?.email || '',
            phoneNo: client.phoneNo,
            gstInNo: client.gstInNo,
        },
    });

    function onClientFormSubmit(data: ClientEditValues) {
        updateClientMutation.mutate({ ...data, id });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onClientFormSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client ID</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter client ID"
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="1234567890" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gstInNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GSTIN Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="22AAAAA0000A1Z5"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={updateClientMutation.isPending}
                    aria-label="Update Client"
                >
                    {updateClientMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        'Update Client'
                    )}
                </Button>
            </form>
        </Form>
    );
}
