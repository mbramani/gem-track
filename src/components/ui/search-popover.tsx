'use client';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { Client } from '@prisma/client';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { useDebounce } from '@/hooks/use-debounce';
import { useState } from 'react';

interface ClientSearchPopoverProps {
    onClientSelect: (clientId: string) => void;
    selectedClientId?: string;
    defaultSelectedClient?: Client | null;
}

export function ClientSearchPopover({
    onClientSelect,
    selectedClientId,
    defaultSelectedClient,
}: ClientSearchPopoverProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = trpc.client.getClients.useQuery(
        {
            pagination: { page: 1, limit: 20 },
            filter: [{ id: 'name', value: debouncedSearch }],
        },
        {
            enabled: debouncedSearch.length > 3,
        }
    );

    const clients: Client[] = data?.clients ?? [];

    const selectedClient = selectedClientId
        ? clients.find((client) => client.id === selectedClientId) ??
          defaultSelectedClient
        : defaultSelectedClient ?? null;

    function handleSelect(clientId: string) {
        onClientSelect(clientId);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Select a client"
                    className={cn(
                        'w-full justify-between',
                        !selectedClientId && 'text-muted-foreground'
                    )}
                >
                    {selectedClient ? selectedClient.name : 'Select client'}
                    <Search className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search clients..."
                        className="h-9"
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {isLoading
                                ? 'Searching...'
                                : error
                                  ? `Error: ${error.message}`
                                  : 'No clients found.'}
                        </CommandEmpty>
                        {!isLoading && !error && clients.length > 0 && (
                            <CommandGroup>
                                {clients.map((client) => (
                                    <CommandItem
                                        key={client.id}
                                        value={client.name}
                                        onSelect={() => handleSelect(client.id)}
                                        className="cursor-pointer"
                                    >
                                        <span className="truncate">
                                            {client.clientId} - {client.name}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
