import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
    columns?: number;
    rows?: number;
}

export function TableSkeleton({ columns = 6, rows = 10 }: TableSkeletonProps) {
    return (
        <div className="w-full space-y-2.5 overflow-auto">
            <TableToolbarSkeleton />

            <div className="overflow-hidden rounded-md border m-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-6 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: columns }).map((_, j) => (
                                    <TableCell key={j}>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center gap-4 justify-end space-x-2">
                <TablePaginationSkeleton />
            </div>
        </div>
    );
}

export function TableToolbarSkeleton() {
    return (
        <div className="flex items-center justify-between flex-wrap gap-2 m-1">
            <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-8 w-10" />
            </div>
            <Skeleton className="h-8 w-24" />
        </div>
    );
}

export function TablePaginationSkeleton() {
    return (
        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
            <Skeleton className="h-4 w-48" />
            <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}
