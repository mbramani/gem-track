'use client';

import { useForm } from 'react-hook-form';
import {
    Client,
    DiamondColor,
    DiamondPacket,
    DiamondPurity,
    DiamondShape,
} from '@prisma/client';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { ClientSearchPopover } from '../ui/search-popover';
import { Input } from '@/components/ui/input';
import { diamondPacketSchema } from '@/schemas';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTimePicker } from '../ui/date-time-picker';

type DiamondPacketFormValues = z.infer<typeof diamondPacketSchema>;

interface DiamondPacketFormProps {
    form: ReturnType<typeof useForm<DiamondPacketFormValues>>;
    onSubmit: (data: DiamondPacketFormValues) => void;
    type: 'create' | 'edit';
    isPending: boolean;
    client?: Client | null;
}

export function DiamondPacketCreateForm() {
    const router = useRouter();

    const form = useForm<DiamondPacketFormValues>({
        resolver: zodResolver(diamondPacketSchema),
        defaultValues: {
            diamondPacketId: '',
            batchNo: 0,
            evNo: 0,
            packetNo: 0,
            lot: 0,
            piece: 0,
            makeableWeight: 0,
            expectedWeight: 0,
            booterWeight: 0,
            diamondShape: DiamondShape.Asscher,
            diamondColor: DiamondColor.D,
            diamondPurity: DiamondPurity.IF,
            receiveDateTime: new Date(),
            deliveryDateTime: undefined,
            clientId: '',
        },
    });

    const diamondPacketCreateMutation = trpc.diamondPacket.create.useMutation({
        onSuccess: () => {
            toast({
                title: 'Diamond packet created',
                description: 'Diamond packet has been created successfully.',
            });
            router.push('/dashboard/diamond-packets');
        },
        onError: (error) => {
            toast({
                title: 'Error creating diamond packet',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onSubmit(data: DiamondPacketFormValues) {
        diamondPacketCreateMutation.mutate(data);
    }

    return (
        <DiamondPacketForm
            type="create"
            form={form}
            onSubmit={onSubmit}
            isPending={diamondPacketCreateMutation.isPending}
        />
    );
}

export function DiamondPacketEditForm({
    initialValues,
}: {
    initialValues: DiamondPacket & { client: Client };
}) {
    const router = useRouter();

    const form = useForm<DiamondPacketFormValues>({
        resolver: zodResolver(diamondPacketSchema),
        defaultValues: {
            diamondPacketId: initialValues?.diamondPacketId || '',
            batchNo: initialValues?.batchNo ? Number(initialValues.batchNo) : 0,
            evNo: initialValues?.evNo || undefined,
            packetNo: initialValues?.packetNo
                ? Number(initialValues.packetNo)
                : 0,
            lot: initialValues?.lot || 0,
            piece: initialValues?.piece || 0,
            makeableWeight: initialValues?.makeableWeight
                ? Number(initialValues.makeableWeight)
                : 0,
            expectedWeight: initialValues?.expectedWeight
                ? Number(initialValues.expectedWeight)
                : 0,
            booterWeight: initialValues?.booterWeight
                ? Number(initialValues.booterWeight)
                : 0,
            diamondShape: initialValues?.diamondShape || DiamondShape.Asscher,
            diamondColor: initialValues?.diamondColor || DiamondColor.D,
            diamondPurity: initialValues?.diamondPurity || DiamondPurity.IF,
            receiveDateTime:
                new Date(initialValues?.receiveDateTime) || new Date(),
            deliveryDateTime: initialValues?.deliveryDateTime
                ? new Date(initialValues.deliveryDateTime)
                : undefined,
            clientId: initialValues?.clientId || '',
        },
    });

    const diamondPacketEditMutation = trpc.diamondPacket.update.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Diamond packet updated',
                description: data.message,
            });
            router.push('/dashboard/diamond-packets');
        },
        onError: (error) => {
            toast({
                title: 'Error updating diamond packet',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onSubmit(data: DiamondPacketFormValues) {
        diamondPacketEditMutation.mutate({
            ...data,
            id: initialValues.id ?? '',
        });
    }

    return (
        <DiamondPacketForm
            type="edit"
            form={form}
            onSubmit={onSubmit}
            isPending={diamondPacketEditMutation.isPending}
            client={initialValues.client}
        />
    );
}

function DiamondPacketForm({
    type,
    form,
    onSubmit,
    isPending,
    client,
}: DiamondPacketFormProps) {
    const router = useRouter();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <fieldset className="space-y-4">
                        <FormField
                            control={form.control}
                            name="diamondPacketId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diamond Packet ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="batchNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Batch Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
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
                            name="evNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>EV Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value
                                                        ? parseInt(
                                                              e.target.value
                                                          )
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
                            name="packetNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Packet Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
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
                            name="lot"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lot</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value)
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
                            name="piece"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Piece</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value)
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
                            name="makeableWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Makeable Weight</FormLabel>
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
                            name="expectedWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Weight</FormLabel>
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
                    </fieldset>
                    <fieldset className="space-y-4">
                        <FormField
                            control={form.control}
                            name="booterWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Booter Weight</FormLabel>
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
                            name="diamondShape"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diamond Shape</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a diamond shape" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(DiamondShape).map(
                                                (shape) => (
                                                    <SelectItem
                                                        key={shape}
                                                        value={shape}
                                                    >
                                                        {shape}
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
                            name="diamondColor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diamond Color</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a diamond color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(DiamondColor).map(
                                                (color) => (
                                                    <SelectItem
                                                        key={color}
                                                        value={color}
                                                    >
                                                        {color}
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
                            name="diamondPurity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diamond Purity</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a diamond purity" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(DiamondPurity).map(
                                                (purity) => (
                                                    <SelectItem
                                                        key={purity}
                                                        value={purity}
                                                    >
                                                        {purity}
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
                            name="receiveDateTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Receive Date Time</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            date={field.value}
                                            onDateChange={(date) =>
                                                form.setValue(
                                                    'receiveDateTime',
                                                    date
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
                            name="deliveryDateTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Delivery Date Time</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            date={field.value}
                                            onDateChange={(date) =>
                                                form.setValue(
                                                    'deliveryDateTime',
                                                    date
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
                            name="clientId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Client</FormLabel>
                                    <ClientSearchPopover
                                        onClientSelect={(clientId) =>
                                            form.setValue('clientId', clientId)
                                        }
                                        selectedClientId={field.value}
                                        defaultSelectedClient={client}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </fieldset>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                {type === 'edit'
                                    ? 'Updating...'
                                    : 'Creating...'}
                            </>
                        ) : type === 'edit' ? (
                            'Update Diamond Packet'
                        ) : (
                            'Create Diamond Packet'
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
