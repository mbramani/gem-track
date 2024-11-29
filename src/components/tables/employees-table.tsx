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
import { Employee } from '@prisma/client';
import { employeeSchema } from '@/schemas';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';

interface DeleteEmployeeDialogProps {
    employee: Employee;
    onDelete: (employee: Employee) => void;
}

const generateEmployeeColumns = (
    onView: (employee: Employee) => void,
    onEdit: (employee: Employee) => void,
    onDelete: (employee: Employee) => void
): ColumnDef<Employee>[] => [
    {
        accessorKey: 'employeeId',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Employee Id" />
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
        accessorKey: 'panNo',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Pan No" />
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
            const employee = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(employee)}
                    >
                        <Eye className="size-4" />
                        <span className="sr-only">View {employee.name}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(employee)}
                    >
                        <Edit className="size-4" />
                        <span className="sr-only">Edit {employee.name}</span>
                    </Button>
                    <DeleteEmployeeDialog
                        employee={employee}
                        onDelete={onDelete}
                    />
                </div>
            );
        },
    },
];

function DeleteEmployeeDialog({
    employee,
    onDelete,
}: DeleteEmployeeDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        onDelete(employee);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* <Button variant="outline" size="sm">
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete {employee.name}</span>
                </Button> */}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the employee &quot;
                        {employee.name}&quot;? This action cannot be undone.
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

export function EmployeesTable() {
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
        trpc.employee.getEmployees.useQuery({
            pagination: { page: pageIndex + 1, limit: pageSize },
            sort: sorting,
            filter: columnFilters,
        });

    const deleteEmployeeMutation = trpc.employee.delete.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Employee deleted',
                description: data.message,
            });
            refetch();
        },
        onError: (error) => {
            toast({
                title: 'Error deleting employee',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onView(employee: Employee) {
        router.push(`employees/${employee.id}`);
    }

    function onEdit(employee: Employee) {
        router.push(`employees/${employee.id}/edit`);
    }

    function onDelete(employee: Employee) {
        deleteEmployeeMutation.mutate({ id: employee.id });
    }

    const table = useReactTable({
        data: data?.employees ?? [],
        pageCount: data?.pages ?? 0,
        columns: generateEmployeeColumns(onView, onEdit, onDelete),
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
                title: 'Error fetching employees',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }, [error]);

    return (
        <DataTable table={table} isLoading={isLoading}>
            <DataTableFilter table={table} schema={employeeSchema} />
            <div className="flex  flex-wrap items-center space-x-2">
                {columnFilters.length > 0 && (
                    <DataTableResetFilterButton table={table} />
                )}
                <DataTableViewOptions table={table} />
            </div>
        </DataTable>
    );
}
