'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { addressSchema } from '@/schemas';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type AddressFormValues = z.infer<typeof addressSchema>;

export function AddressForm({ addressId }: { addressId: string }) {
    const router = useRouter();
    const [{ address }] = trpc.address.getById.useSuspenseQuery({
        id: addressId,
    });

    const updateAddressMutation = trpc.address.update.useMutation({
        onError(error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSuccess(data) {
            toast({
                title: 'Address updated',
                description: data.message,
            });
        },
    });

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
        },
    });

    function onAddressFormSubmit(data: AddressFormValues) {
        updateAddressMutation.mutate({ ...data, id: addressId });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onAddressFormSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                                <Input placeholder="Apt 4B" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="Surat" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input placeholder="Gujarat" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input placeholder="India" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                                <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between">
                    <Button
                        type="submit"
                        disabled={updateAddressMutation.isPending}
                        aria-label="Update Address"
                    >
                        {updateAddressMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Address'
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
