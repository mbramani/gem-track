'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    DataTable,
    DataTableFilter,
    DataTableResetFilterButton,
    DataTableSortableHeader,
    DataTableViewOptions,
} from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Client } from '@prisma/client';
import { clientSchema } from '@/schemas';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';

interface DeleteClientDialogProps {
    client: Client;
    onDelete: (client: Client) => void;
}

const generateClientColumns = (
    onView: (client: Client) => void,
    onEdit: (client: Client) => void,
    onDelete: (client: Client) => void
): ColumnDef<Client>[] => [
    {
        accessorKey: 'clientId',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Client Id" />
        ),
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: 'phoneNo',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Phone" />
        ),
    },
    {
        accessorKey: 'gstInNo',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="GSTIN" />
        ),
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const client = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(client)}
                    >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View {client.name}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(client)}
                    >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit {client.name}</span>
                    </Button>
                    <DeleteClientDialog client={client} onDelete={onDelete} />
                </div>
            );
        },
    },
];

function DeleteClientDialog({ client, onDelete }: DeleteClientDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        onDelete(client);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {client.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the client &quot;
                        {client.name}&quot;? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function ClientsTable() {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const { data, isLoading, error, refetch } = trpc.client.getClients.useQuery(
        {
            pagination: { page: pageIndex + 1, limit: pageSize },
            sort: sorting,
            filter: columnFilters,
        }
    );

    const deleteClientMutation = trpc.client.delete.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Client deleted',
                description: data.message,
            });
            refetch();
        },
        onError: (error) => {
            toast({
                title: 'Error deleting client',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onView(client: Client) {
        router.push(`clients/${client.id}`);
    }

    function onEdit(client: Client) {
        router.push(`clients/${client.id}/edit`);
    }

    function onDelete(client: Client) {
        deleteClientMutation.mutate({ id: client.id });
    }

    const table = useReactTable({
        data: data?.clients ?? [],
        pageCount: data?.pages ?? 0,
        columns: generateClientColumns(onView, onEdit, onDelete),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        enableMultiSort: true,
        manualSorting: true,
        manualExpanding: true,
        manualPagination: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
        },
    });

    useEffect(() => {
        if (error) {
            const errorMessage =
                error.data?.zodError?.fieldErrors['filter']?.join(' ') ||
                error.message ||
                'An unexpected error occurred.';

            toast({
                title: 'Error fetching clients',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }, [error]);

    return (
        <DataTable table={table} isLoading={isLoading}>
            <DataTableFilter table={table} schema={clientSchema} />
            <div className="flex flex-wrap items-center space-x-2">
                {columnFilters.length > 0 && (
                    <DataTableResetFilterButton table={table} />
                )}
                <DataTableViewOptions table={table} />
            </div>
        </DataTable>
    );
}
