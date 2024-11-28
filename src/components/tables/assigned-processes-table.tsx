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
    DataTableSortableHeader,
    DataTableViewOptions,
} from '@/components/ui/data-table';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DiamondPacketProcess } from '@prisma/client';
import { Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';

const generateAssignedProcessColumns = (
    onEdit: (process: DiamondPacketProcess) => void
): ColumnDef<DiamondPacketProcess>[] => [
    {
        accessorKey: 'process.name',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Process" />
        ),
    },
    {
        accessorKey: 'employee.name',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Employee" />
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Status" />
        ),
    },
    {
        accessorKey: 'startDateTime',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Start Date" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
    },
    {
        accessorKey: 'endDateTime',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="End Date" />
        ),
        cell: ({ cell }) => {
            const value = cell.getValue() as Date | undefined;
            return value ? formatDate(value) : 'N/A';
        },
        enableColumnFilter: false,
    },
    {
        accessorKey: 'beforeWeight',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Before Wt." />
        ),
        cell: ({ cell }) => `${cell.getValue()} ct`,
    },
    {
        accessorKey: 'afterWeight',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="After Wt." />
        ),
        cell: ({ cell }) => {
            const value = Number(cell.getValue());
            return value ? `${value} ct` : 'N/A';
        },
    },
    {
        accessorKey: 'remarks',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Remarks" />
        ),
        cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const process = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(process)}
                    >
                        <Edit className="size-4" />
                        <span className="sr-only">Edit Process</span>
                    </Button>
                </div>
            );
        },
    },
];

export function AssignedProcessesTable({
    diamondPacketId,
}: {
    diamondPacketId: string;
}) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
        { id: 'diamondPacketId', value: diamondPacketId },
    ]);
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

    const { data, isLoading, error, refetch } =
        trpc.diamondPacket.getAssignedProcesses.useQuery({
            pagination: { page: pageIndex + 1, limit: pageSize },
            sort: sorting,
            filter: columnFilters,
        });

    function onEdit(process: DiamondPacketProcess) {
        router.push(`${diamondPacketId}/assign/${process.id}/edit`);
    }

    const table = useReactTable({
        data: data?.assignedProcesses ?? [],
        pageCount: data?.pages ?? 0,
        columns: generateAssignedProcessColumns(onEdit),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
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
                title: 'Error fetching assigned processes',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }, [error]);

    return (
        <DataTable table={table} isLoading={isLoading}>
            <DataTableViewOptions table={table} />
        </DataTable>
    );
}
