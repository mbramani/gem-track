'use client';

import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    RotateCcw,
    Search,
    Settings2,
} from 'lucide-react';
import {
    Column,
    Table as TanstackTable,
    flexRender,
} from '@tanstack/react-table';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './tooltip';
import { cn, toSentenceCase } from '@/lib/utils';
import { useRef, useState } from 'react';

import { Button } from './button';
import { Input } from './input';
import { TableSkeleton } from '../skeletons/table';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
    table: TanstackTable<TData>;
    className?: string;
    isLoading?: boolean;
}

interface DataTableFilterProps<TData, TSchema> {
    table: TanstackTable<TData>;
    schema: TSchema;
}

interface DataTablePaginationProps<TData> {
    table: TanstackTable<TData>;
    pageSizeOptions?: number[];
}

interface DataTableResetFilterButtonProps<TData> {
    table: TanstackTable<TData>;
}

interface DataTableViewOptionsProps<TData> {
    table: TanstackTable<TData>;
}

interface DataTableSortableHeaderProps<TData> {
    column: Column<TData, unknown>;
    title: string;
}

export function DataTable<TData>({
    table,
    className,
    isLoading,
    children,
    ...props
}: DataTableProps<TData>) {
    if (isLoading) {
        return (
            <TableSkeleton columns={table.getAllColumns().length} rows={10} />
        );
    }

    return (
        <div
            className={cn('w-full space-y-2.5 overflow-auto', className)}
            {...props}
        >
            <div className="flex items-center justify-between flex-wrap gap-2 m-1">
                {children}
            </div>
            <div className="overflow-hidden rounded-md border m-1">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center gap-4 justify-end space-x-2">
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}

export function DataTableFilter<
    TData,
    TSchema extends z.ZodObject<z.ZodRawShape>,
>({ table, schema }: DataTableFilterProps<TData, TSchema>) {
    const triggerRef = useRef<HTMLButtonElement>(null);

    const [selectedColumn, setSelectedColumn] = useState<string>(() => {
        const filteredColumn = table
            .getAllColumns()
            .find((column) => column.getIsFiltered());
        return filteredColumn?.id || table.getAllColumns()[0]?.id || '';
    });

    const [searchValue, setSearchValue] = useState<string>(
        table.getColumn(selectedColumn)?.getFilterValue() as string
    );

    const handleColumnChange = (columnId: string) => {
        if (selectedColumn) {
            table.getColumn(selectedColumn)?.setFilterValue(undefined);
        }

        setSelectedColumn(columnId);
        setSearchValue('');
    };

    const handleSearch = () => {
        if (!selectedColumn) return;

        const fieldSchema = schema.shape[selectedColumn] as z.ZodTypeAny;
        if (!fieldSchema) return;

        try {
            fieldSchema.parse(searchValue);
            table.getColumn(selectedColumn)?.setFilterValue(searchValue);
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast({
                    title: 'Invalid input',
                    description:
                        err.errors[0]?.message || 'Invalid input value',
                    variant: 'destructive',
                });
            }
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Popover modal>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        aria-label="Select column to search"
                        variant="outline"
                        role="combobox"
                        size="sm"
                        className="w-28 justify-between"
                    >
                        {selectedColumn
                            ? toSentenceCase(selectedColumn)
                            : 'Select column'}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    className="w-44 p-0"
                    onCloseAutoFocus={() => triggerRef.current?.focus()}
                >
                    <Command>
                        <CommandInput placeholder="Search columns..." />
                        <CommandList>
                            <CommandEmpty>No columns found.</CommandEmpty>
                            <CommandGroup>
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanFilter())
                                    .map((column) => {
                                        return (
                                            <CommandItem
                                                key={column.id}
                                                onSelect={() =>
                                                    handleColumnChange(
                                                        column.id
                                                    )
                                                }
                                                role="option"
                                                aria-selected={
                                                    column.id === selectedColumn
                                                }
                                                className="cursor-pointer"
                                            >
                                                <span className="truncate">
                                                    {toSentenceCase(column.id)}
                                                </span>
                                            </CommandItem>
                                        );
                                    })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex items-center space-x-2">
                <Input
                    placeholder={
                        selectedColumn
                            ? `Search ${toSentenceCase(selectedColumn)}...`
                            : 'Select a column'
                    }
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-8 w-52"
                    disabled={!selectedColumn}
                />
                <Button
                    size="sm"
                    onClick={handleSearch}
                    disabled={!selectedColumn || !searchValue}
                >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
        </div>
    );
}

export function DataTableResetFilterButton<TData>({
    table,
}: DataTableResetFilterButtonProps<TData>) {
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleResetFilters = () => {
        table.resetColumnFilters();
    };

    return (
        <Button
            ref={triggerRef}
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
        >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline-block">Reset</span>
        </Button>
    );
}

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    aria-label="Toggle columns"
                    variant="outline"
                    role="combobox"
                    size="sm"
                >
                    <Settings2 className="size-4" />
                    View
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-44 p-0"
                onCloseAutoFocus={() => triggerRef.current?.focus()}
            >
                <Command>
                    <CommandInput placeholder="Search columns..." />
                    <CommandList>
                        <CommandEmpty>No columns found.</CommandEmpty>
                        <CommandGroup>
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !==
                                            'undefined' && column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <CommandItem
                                            key={column.id}
                                            onSelect={() =>
                                                column.toggleVisibility(
                                                    !column.getIsVisible()
                                                )
                                            }
                                            role="option"
                                            aria-selected={column.getIsVisible()}
                                            className="cursor-pointer"
                                        >
                                            <span className="truncate">
                                                {toSentenceCase(column.id)}
                                            </span>
                                            <Check
                                                className={cn(
                                                    'ml-auto size-4 shrink-0',
                                                    column.getIsVisible()
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    );
                                })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function DataTableSortableHeader<TData>({
    column,
    title,
}: DataTableSortableHeaderProps<TData>) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            const isMultiSort = e.shiftKey;
                            column.toggleSorting(
                                column.getIsSorted() === 'asc',
                                isMultiSort
                            );
                        }}
                        className="flex items-center -ml-2 !p-1.5"
                        aria-label={`Sort by ${title}`}
                    >
                        {title}
                        <div className="flex items-center">
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 h-4 w-4" />
                            ) : column.getIsSorted() === 'desc' ? (
                                <ArrowDown className="ml-1 h-4 w-4" />
                            ) : (
                                <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                            {column.getSortIndex() >= 0 && (
                                <span className="text-xs bg-primary-foreground p-0.5 rounded-full w-5 h-5 ml-1">
                                    {column.getSortIndex() + 1}
                                </span>
                            )}
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        Click to sort. Hold Shift and click for multi-column
                        sort.
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function DataTablePagination<TData>({
    table,
    pageSizeOptions = [5, 10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
            <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                    <p className="whitespace-nowrap text-sm font-medium">
                        Rows per page
                    </p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                        aria-label="Rows per page"
                    >
                        <SelectTrigger className="h-8 w-16">
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((pageSize) => (
                                <SelectItem
                                    className="cursor-pointer"
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        aria-label="Go to first page"
                        variant="outline"
                        className="size-8 p-0 flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                        aria-label="Go to previous page"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                        aria-label="Go to next page"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                        aria-label="Go to last page"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="size-4" aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
