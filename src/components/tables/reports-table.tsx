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
import { Download, Edit, Eye, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Decimal } from '@prisma/client/runtime/library';
import { Report } from '@prisma/client';
import { format } from 'date-fns';
import { formatDate } from '@/lib/utils';
import { reportSchema } from '@/schemas';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';

interface DeleteReportDialogProps {
    report: Report;
    onDelete: (report: Report) => void;
}

const generateReportColumns = (
    onView: (report: Report) => void,
    onDownload: (report: Report) => void,
    onDelete: (report: Report) => void
): ColumnDef<Report>[] => [
    {
        accessorKey: 'reportId',
        header: ({ column }) => (
            <DataTableSortableHeader column={column} title="Report Id" />
        ),
    },
    {
        accessorKey: 'client.clientId',
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex items-center -ml-2 !p-1.5 text-sm"
            >
                Client Id
            </Button>
        ),
        enableColumnFilter: false,
    },
    {
        accessorKey: 'client.name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex items-center -ml-2 !p-1.5 text-sm"
            >
                Client Name
            </Button>
        ),
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
            const report = row.original;
            return (
                <div className="flex justify-end gap-2">
                    {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(report)}
                    >
                        <Eye className="size-4" />
                        <span className="sr-only">View {report.reportId}</span>
                    </Button> */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(report)}
                    >
                        <Download className="size-4" />
                        <span className="sr-only">
                            Download {report.reportId}
                        </span>
                    </Button>
                    <DeleteReportDialog report={report} onDelete={onDelete} />
                </div>
            );
        },
    },
];

function DeleteReportDialog({ report, onDelete }: DeleteReportDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        onDelete(report);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete {report.reportId}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the report &quot;
                        {report.reportId}&quot;? This action cannot be undone.
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

export function ReportsTable() {
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

    const [downloadReportId, setDownloadReportId] = useState<string | null>(
        null
    );
    const { data, isLoading, error, refetch } = trpc.report.getReports.useQuery(
        {
            pagination: { page: pageIndex + 1, limit: pageSize },
            sort: sorting,
            filter: columnFilters,
        }
    );

    const deleteReportMutation = trpc.report.delete.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Report deleted',
                description: data.message,
            });
            refetch();
        },
        onError: (error) => {
            toast({
                title: 'Error deleting report',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const getReportByIdQuery = trpc.report.getById.useQuery(
        { id: downloadReportId || '' },
        {
            enabled: !!downloadReportId,
        }
    );

    function onView(report: Report) {
        router.push(`reports/${report.id}`);
    }

    async function onDownload(report: Report) {
        setDownloadReportId(report.id);
    }

    function onDelete(report: Report) {
        deleteReportMutation.mutate({ id: report.id });
    }

    const table = useReactTable({
        data: data?.reports ?? [],
        pageCount: data?.pages ?? 0,
        columns: generateReportColumns(onView, onDownload, onDelete),
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
                title: 'Error fetching reportes',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }, [error]);

    const handleDownload = useCallback(
        (data: typeof getReportByIdQuery.data) => {
            try {
                const csvContent = convertReportToCSV(data);
                const blob = new Blob([csvContent], {
                    type: 'text/csv;charset=utf-8;',
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = `report-${data?.report.reportId}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
                document.body.appendChild(link);
                link.click();

                return { url, link };
            } catch (error) {
                throw error;
            }
        },
        [getReportByIdQuery]
    );

    useEffect(() => {
        let url: string | null = null;
        let link: HTMLAnchorElement | null = null;

        if (getReportByIdQuery.data?.report && downloadReportId) {
            try {
                const result = handleDownload(getReportByIdQuery.data);
                url = result.url;
                link = result.link;
            } catch (error) {
                toast({
                    title: 'Download failed',
                    description:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    variant: 'destructive',
                });
            } finally {
                setDownloadReportId(null);
            }
        }

        if (getReportByIdQuery.error) {
            toast({
                title: 'Download failed',
                description: getReportByIdQuery.error.message,
                variant: 'destructive',
            });
            setDownloadReportId(null);
        }

        // Cleanup function
        return () => {
            if (url) URL.revokeObjectURL(url);
            if (link?.parentNode) link.parentNode.removeChild(link);
        };
    }, [
        getReportByIdQuery.data,
        getReportByIdQuery.error,
        downloadReportId,
        handleDownload,
    ]);

    function convertReportToCSV(data: typeof getReportByIdQuery.data): string {
        if (!data?.report) return '';

        const formatNumber = (value: number | Decimal | string) =>
            Number(value).toFixed(4);

        const formatDate = (date: Date) =>
            new Date(date).toLocaleDateString('en-US');

        const headers = [
            'Report ID',
            'Client ID',
            'Client Name',
            'Diamond Packet ID',
            'Batch No',
            'EV No',
            'Packet No',
            'Lot',
            'Piece',
            'Makeable Weight',
            'Expected Weight',
            'Booter Weight',
            'Diamond Shape',
            'Diamond Color',
            'Diamond Purity',
            'Size',
            'Expected %',
            'Final Weight',
            'Final %',
        ].join(',');

        const rows = data.report.reportItems.map((dp) => {
            return [
                `"${data.report.reportId}"`,
                `"${data.report.client.clientId}"`,
                `"${data.report.client.name}"`,
                `"${dp.diamondPacketId}"`,
                `"${dp.batchNo}"`,
                dp.evNo,
                `"${dp.packetNo}"`,
                dp.lot,
                dp.piece,
                formatNumber(dp.makeableWeight),
                formatNumber(dp.expectedWeight),
                formatNumber(dp.booterWeight),
                `"${dp.diamondShape}"`,
                `"${dp.diamondColor}"`,
                `"${dp.diamondPurity}"`,
                formatNumber(dp.size),
                formatNumber(dp.expectedPercentage),
                formatNumber(dp.finalWeight),
                formatNumber(dp.finalPercentage),
            ].join(',');
        });

        // Add summary row
        const summary = [
            '"TOTALS"',
            '""',
            '""',
            '""',
            '""',
            '""',
            '""',
            data.report.statistics.totalLot,
            data.report.statistics.totalPiece,
            formatNumber(data.report.statistics.totalMakeableWeight),
            formatNumber(data.report.statistics.totalExpectedWeight),
            '""',
            '""',
            '""',
            '""',
            '""',
            '""',
            formatNumber(data.report.statistics.totalFinalWeight),
            '""',
        ].join(',');

        // Add metadata row
        const metadata = [
            '',
            `"Report Generated: ${formatDate(new Date())}"`,
            `"Client: ${data.report.client.name}"`,
            `"Contact: ${data.report.client.email}"`,
            `"Phone: ${data.report.client.phoneNo}"`,
            `"GSTIN: ${data.report.client.gstInNo}"`,
        ].join(',');

        return [metadata, '', headers, ...rows, '', summary].join('\n');
    }
    return (
        <DataTable table={table} isLoading={isLoading}>
            <DataTableFilter table={table} schema={reportSchema} />
            <div className="flex flex-wrap items-center space-x-2">
                {columnFilters.length > 0 && (
                    <DataTableResetFilterButton table={table} />
                )}
                <DataTableViewOptions table={table} />
            </div>
        </DataTable>
    );
}
