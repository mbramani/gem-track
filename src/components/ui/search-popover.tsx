'use client';

import { Client, Employee, Process } from '@prisma/client';
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

interface EmployeeSearchPopoverProps {
    onEmployeeSelect: (employeeId: string) => void;
    selectedEmployeeId?: string;
    defaultSelectedEmployee?: Employee | null;
}

interface ProcessSearchPopoverProps {
    onProcessSelect: (processId: string) => void;
    selectedProcessId?: string;
    defaultSelectedProcess?: Process | null;
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
        ? (clients.find((client) => client.id === selectedClientId) ??
          defaultSelectedClient)
        : (defaultSelectedClient ?? null);

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
            <PopoverContent className="w-full p-0" align="start">
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

export function ProcessSearchPopover({
    onProcessSelect,
    selectedProcessId,
    defaultSelectedProcess,
}: ProcessSearchPopoverProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = trpc.process.getProcesses.useQuery(
        {
            pagination: { page: 1, limit: 20 },
            filter: [{ id: 'name', value: debouncedSearch }],
        },
        {
            enabled: debouncedSearch.length > 3,
        }
    );

    const processes: Process[] = data?.processes ?? [];

    const selectedProcess = selectedProcessId
        ? (processes.find((process) => process.id === selectedProcessId) ??
          defaultSelectedProcess)
        : defaultSelectedProcess;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selectedProcess?.name ?? 'Select process...'}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search process..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {isLoading
                                ? 'Searching...'
                                : error
                                  ? `Error: ${error.message}`
                                  : 'No process found.'}
                        </CommandEmpty>
                        {!isLoading && !error && processes.length > 0 && (
                            <CommandGroup>
                                {processes.map((process) => (
                                    <CommandItem
                                        key={process.id}
                                        onSelect={() => {
                                            onProcessSelect(process.id);
                                            setOpen(false);
                                        }}
                                    >
                                        {process.name}
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

export function EmployeeSearchPopover({
    onEmployeeSelect,
    selectedEmployeeId,
    defaultSelectedEmployee,
}: EmployeeSearchPopoverProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = trpc.employee.getEmployees.useQuery(
        {
            pagination: { page: 1, limit: 20 },
            filter: [{ id: 'name', value: debouncedSearch }],
        },
        {
            enabled: debouncedSearch.length > 3,
        }
    );

    const employees: Employee[] = data?.employees ?? [];

    const selectedEmployee = selectedEmployeeId
        ? (employees.find((employee) => employee.id === selectedEmployeeId) ??
          defaultSelectedEmployee)
        : defaultSelectedEmployee;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selectedEmployee?.name ?? 'Select employee...'}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search employee..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {isLoading
                                ? 'Searching...'
                                : error
                                  ? `Error: ${error.message}`
                                  : 'No employee found.'}
                        </CommandEmpty>
                        {!isLoading && !error && employees.length > 0 && (
                            <CommandGroup>
                                {employees.map((employee) => (
                                    <CommandItem
                                        key={employee.id}
                                        onSelect={() => {
                                            onEmployeeSelect(employee.id);
                                            setOpen(false);
                                        }}
                                    >
                                        {employee.name}
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
