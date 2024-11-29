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
import { Process } from '@prisma/client';
import { formatDate } from '@/lib/utils';
import { processSchema } from '@/schemas';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';

interface DeleteProcessDialogProps {
    process: Process;
    onDelete: (process: Process) => void;
}

const generateProcessColumns = (
    onView: (process: Process) => void,
    onEdit: (process: Process) => void,
    onDelete: (process: Process) => void
): ColumnDef<Process>[] => [
    {
        accessorKey: 'processId',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Process Id" />
        ),
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Description" />
        ),
        cell: ({ cell }) => {
            const text = String(cell.getValue() || '');
            return text.length > 20 ? (
                <span title={text}>{text.slice(0, 20).trim() + '...'}</span>
            ) : (
                text
            );
        },
    },
    {
        accessorKey: 'price',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Price" />
        ),
    },
    {
        accessorKey: 'cost',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Cost" />
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
            const process = row.original;
            return (
                <div className="flex justify-end gap-2">
                    {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(process)}
                    >
                        <Eye className="size-4" />
                        <span className="sr-only">View {process.name}</span>
                    </Button> */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(process)}
                    >
                        <Edit className="size-4" />
                        <span className="sr-only">Edit {process.name}</span>
                    </Button>
                    <DeleteProcessDialog
                        process={process}
                        onDelete={onDelete}
                    />
                </div>
            );
        },
    },
];

function DeleteProcessDialog({ process, onDelete }: DeleteProcessDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        onDelete(process);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete {process.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the process &quot;
                        {process.name}&quot;? This action cannot be undone.
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

export function ProcessesTable() {
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

    const { data, isLoading, error, refetch } =
        trpc.process.getProcesses.useQuery({
            pagination: { page: pageIndex + 1, limit: pageSize },
            sort: sorting,
            filter: columnFilters,
        });

    const deleteProcessMutation = trpc.process.delete.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Process deleted',
                description: data.message,
            });
            refetch();
        },
        onError: (error) => {
            toast({
                title: 'Error deleting process',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onView(process: Process) {
        router.push(`processes/${process.id}`);
    }

    function onEdit(process: Process) {
        router.push(`processes/${process.id}/edit`);
    }

    function onDelete(process: Process) {
        deleteProcessMutation.mutate({ id: process.id });
    }

    const table = useReactTable({
        data: data?.processes ?? [],
        pageCount: data?.pages ?? 0,
        columns: generateProcessColumns(onView, onEdit, onDelete),
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
                title: 'Error fetching processes',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }, [error]);

    return (
        <DataTable table={table} isLoading={isLoading}>
            <DataTableFilter table={table} schema={processSchema} />
            <div className="flex flex-wrap items-center space-x-2">
                {columnFilters.length > 0 && (
                    <DataTableResetFilterButton table={table} />
                )}
                <DataTableViewOptions table={table} />
            </div>
        </DataTable>
    );
}
