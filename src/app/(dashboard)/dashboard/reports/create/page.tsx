'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChevronsUpDown, Loader2, Search } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Controller, useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { reportSchema } from '@/schemas';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportForm() {
    const router = useRouter();
    const [clientOpen, setClientOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const [diamondPacketsOpen, setDiamondPacketsOpen] = useState(false);
    const debouncedClientSearch = useDebounce(clientSearch, 500);
    const debouncedDPSearch = useDebounce(diamondPacketsOpen, 500);

    const [selectedClient, setSelectedClient] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            reportId: '',
            clientId: '',
            diamondPacketIds: [],
        },
    });

    const reportMutation = trpc.report.create.useMutation({
        onSuccess: () => {
            toast({
                title: 'Report created successfully',
                description: 'Report has been created successfully',
            });
            router.push('reports');
        },
        onError: (error) => {
            toast({
                title: 'Error creating report',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const { data: clients, isLoading: isLoadingClients } =
        trpc.client.getClients.useQuery(
            {
                pagination: { page: 1, limit: 20 },
                filter: [{ id: 'name', value: debouncedClientSearch }],
            },
            {
                enabled: clientOpen && debouncedClientSearch.length > 2,
            }
        );

    const { data: diamondPackets, isLoading: isLoadingDiamondPackets } =
        trpc.diamondPacket.getDiamondPackets.useQuery(
            {
                pagination: { page: 1, limit: 20 },
                filter: [{ id: 'clientId', value: selectedClient?.id }],
            },
            { enabled: !!selectedClient }
        );

    function onSubmit(data: ReportFormValues) {
        reportMutation.mutate(data);
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Create Report
            </h1>
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Create New Report</CardTitle>
                    <CardDescription>
                        Enter the details to create a new report
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="reportId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Report ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <Popover
                                            open={clientOpen}
                                            onOpenChange={setClientOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={
                                                            clientOpen
                                                        }
                                                        className={cn(
                                                            'w-full justify-between',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {selectedClient
                                                            ? selectedClient.name
                                                            : 'Select client'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search clients..."
                                                        className="h-9"
                                                        value={clientSearch}
                                                        onValueChange={
                                                            setClientSearch
                                                        }
                                                    />
                                                    {isLoadingClients ? (
                                                        <CommandEmpty>
                                                            Searching...
                                                        </CommandEmpty>
                                                    ) : (
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No client found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {clients?.clients.map(
                                                                    (
                                                                        client
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                client.id
                                                                            }
                                                                            value={
                                                                                client.name
                                                                            }
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    'clientId',
                                                                                    client.id
                                                                                );
                                                                                setSelectedClient(
                                                                                    client
                                                                                );
                                                                                setClientOpen(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                client.name
                                                                            }
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    )}
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="diamondPacketIds"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Diamond Packets</FormLabel>
                                        <Popover
                                            open={diamondPacketsOpen}
                                            onOpenChange={setDiamondPacketsOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={
                                                            diamondPacketsOpen
                                                        }
                                                        className={cn(
                                                            'w-full justify-between',
                                                            !field.value
                                                                .length &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value.length
                                                            ? `${field.value.length} packet${field.value.length > 1 ? 's' : ''} selected`
                                                            : 'Select diamond packets'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search diamond packets..."
                                                        className="h-9"
                                                    />
                                                    {isLoadingDiamondPackets ? (
                                                        <CommandEmpty>
                                                            Loading...
                                                        </CommandEmpty>
                                                    ) : (
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No diamond
                                                                packets found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {diamondPackets?.diamondPackets.map(
                                                                    (
                                                                        packet
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                packet.id
                                                                            }
                                                                            value={
                                                                                packet.diamondPacketId
                                                                            }
                                                                            onSelect={() => {
                                                                                const currentIds =
                                                                                    field.value;
                                                                                const updatedIds =
                                                                                    currentIds.includes(
                                                                                        packet.id
                                                                                    )
                                                                                        ? currentIds.filter(
                                                                                              (
                                                                                                  id
                                                                                              ) =>
                                                                                                  id !==
                                                                                                  packet.id
                                                                                          )
                                                                                        : [
                                                                                              ...currentIds,
                                                                                              packet.id,
                                                                                          ];
                                                                                form.setValue(
                                                                                    'diamondPacketIds',
                                                                                    updatedIds
                                                                                );
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="mr-2"
                                                                                    checked={field.value.includes(
                                                                                        packet.id
                                                                                    )}
                                                                                    readOnly
                                                                                />
                                                                                {
                                                                                    packet.diamondPacketId
                                                                                }
                                                                            </div>
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    )}
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <CardFooter className="flex justify-end gap-2 p-0">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={reportMutation.isPending}
                                >
                                    {reportMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Report'
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
