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
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Client } from '@prisma/client';
import { clientSchema } from '@/schemas';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';

const columns: ColumnDef<Client>[] = [
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
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View {client.name}</span>
                    </Button>
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit {client.name}</span>
                    </Button>
                    <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {client.name}</span>
                    </Button>
                </div>
            );
        },
    },
];

export function ClientsTable() {
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

    const { data, isLoading, error } = trpc.client.getClients.useQuery({
        pagination: { page: pageIndex + 1, limit: pageSize },
        sort: sorting,
        filter: columnFilters,
    });

    const table = useReactTable({
        data: data?.clients ?? [],
        pageCount: data?.pages ?? 0,
        columns,
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
            <div className="flex  flex-wrap items-center space-x-2">
                {columnFilters.length > 0 && (
                    <DataTableResetFilterButton table={table} />
                )}
                <DataTableViewOptions table={table} />
            </div>
        </DataTable>
    );
}
