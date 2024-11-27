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
import { DiamondPacket } from '@prisma/client';
import { diamondPacketSchema } from '@/schemas';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';

interface DeleteDiamondPacketDialogProps {
    diamondPacket: DiamondPacket;
    onDelete: (diamondPacket: DiamondPacket) => void;
}

const generateClientColumns = (
    onView: (diamondPacket: DiamondPacket) => void,
    onEdit: (diamondPacket: DiamondPacket) => void,
    onDelete: (diamondPacket: DiamondPacket) => void
): ColumnDef<DiamondPacket>[] => [
    {
        accessorKey: 'diamondPacketId',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Id" />
        ),
    },
    {
        accessorKey: 'batchNo',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Batch No" />
        ),
    },
    {
        accessorKey: 'evNo',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="EV No" />
        ),
        enableColumnFilter: false,
    },
    {
        accessorKey: 'packetNo',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Packet No" />
        ),
    },
    {
        accessorKey: 'lot',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Lot" />
        ),
        enableColumnFilter: false,
    },
    {
        accessorKey: 'piece',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Piece" />
        ),
        enableColumnFilter: false,
    },
    {
        accessorKey: 'makeableWeight',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Makeable Wt." />
        ),
    },
    {
        accessorKey: 'expectedWeight',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Expected Wt." />
        ),
    },
    {
        accessorKey: 'booterWeight',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Booter Wt." />
        ),
    },
    {
        accessorKey: 'diamondShape',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Shape" />
        ),
    },
    {
        accessorKey: 'diamondColor',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Color" />
        ),
    },
    {
        accessorKey: 'diamondPurity',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Purity" />
        ),
    },
    {
        accessorKey: 'size',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Size" />
        ),
        enableColumnFilter: false,
    },
    {
        accessorKey: 'expectedPercentage',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Expected %" />
        ),
        cell: ({ cell }) => `${cell.getValue()}%`,
        enableColumnFilter: false,
    },
    {
        accessorKey: 'receiveDateTime',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Receive At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
    },
    {
        accessorKey: 'deliveryDateTime',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Delivery At" />
        ),
        cell: ({ cell }) =>
            cell.getValue() ? formatDate(cell.getValue() as Date) : 'N/A',
        enableColumnFilter: false,
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
            const diamondPacket = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(diamondPacket)}
                    >
                        <Eye className="size-4" />
                        <span className="sr-only">
                            View {diamondPacket.diamondPacketId}
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(diamondPacket)}
                    >
                        <Edit className="size-4" />
                        <span className="sr-only">
                            Edit {diamondPacket.diamondPacketId}
                        </span>
                    </Button>
                    <DeleteDiamondPacketDialog
                        diamondPacket={diamondPacket}
                        onDelete={onDelete}
                    />
                </div>
            );
        },
    },
];

function DeleteDiamondPacketDialog({
    diamondPacket,
    onDelete,
}: DeleteDiamondPacketDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        onDelete(diamondPacket);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Trash2 className="size-4" />
                    <span className="sr-only">
                        Delete {diamondPacket.diamondPacketId}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the diamond packet
                        &quot;
                        {diamondPacket.diamondPacketId}&quot;? This action
                        cannot be undone.
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

export function DiamondPacketsTable() {
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
        trpc.diamondPacket.getDiamondPackets.useQuery({
            pagination: { page: pageIndex + 1, limit: pageSize },
            sort: sorting,
            filter: columnFilters,
        });

    const deleteClientMutation = trpc.diamondPacket.delete.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'DiamondPacket deleted',
                description: data.message,
            });
            refetch();
        },
        onError: (error) => {
            toast({
                title: 'Error deleting diamondPacket',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onView(diamondPacket: DiamondPacket) {
        router.push(`diamond-packets/${diamondPacket.id}`);
    }

    function onEdit(diamondPacket: DiamondPacket) {
        router.push(`diamond-packets/${diamondPacket.id}/edit`);
    }

    function onDelete(diamondPacket: DiamondPacket) {
        deleteClientMutation.mutate({ id: diamondPacket.id });
    }

    const table = useReactTable({
        data: data?.diamondPackets ?? [],
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
            <DataTableFilter table={table} schema={diamondPacketSchema} />
            <div className="flex flex-wrap items-center space-x-2">
                {columnFilters.length > 0 && (
                    <DataTableResetFilterButton table={table} />
                )}
                <DataTableViewOptions table={table} />
            </div>
        </DataTable>
    );
}
