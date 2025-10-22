"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable, VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import {useEffect, useRef, useState} from "react";
import {DataTablePagination} from "@/components/ui/table/data-table-pagination.tsx";
import {cn} from "@/lib/utils.ts";
import {AlertCircleIcon} from "lucide-react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {ApolloError} from "@apollo/client";
import {DataTableViewOptions} from "@/components/ui/table/data-table-column-visbility.tsx";

declare module "@tanstack/table-core" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData, TValue> {
        hidden?: boolean;
    }
}

interface DataTableProps<TData, TValue> {
    className?: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    dataTablePagination?: boolean;
}

function DataTable<TData, TValue>(
    {
        className,
        columns,
        data,
        onRowSelectionChange,
        dataTablePagination = true,
    }: Readonly<DataTableProps<TData, TValue>>
) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Object.fromEntries(
            columns.map(c => [c.id, !(c.meta?.hidden ?? false)])
        )
    );
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: dataTablePagination ? 25 : Number.MAX_SAFE_INTEGER,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    const onRowSelectionChangeRef = useRef(onRowSelectionChange);
    useEffect(() => {
        onRowSelectionChangeRef.current = onRowSelectionChange;
    }, [onRowSelectionChange]);

    useEffect(() => {
        if (!onRowSelectionChangeRef.current) return;
        const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
        onRowSelectionChangeRef.current(selectedRows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

    return (
        <div className={cn(className)}>
            <div className="flex items-center p-4">
                <DataTableViewOptions table={table}/>
            </div>
            <div className="overflow-hidden rounded-xs border">
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
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm px-2">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                {dataTablePagination && <DataTablePagination table={table}/>}
            </div>
        </div>
    );
}

function ScrollableDataTable<TData, TValue>(
    {
        columns,
        data,
        onRowSelectionChange,
        dataTablePagination,
    }: Readonly<DataTableProps<TData, TValue>>
) {
    return (
        <ScrollArea className={cn("w-full whitespace-nowrap")}>
            <DataTable
                columns={columns}
                data={data}
                onRowSelectionChange={onRowSelectionChange}
                dataTablePagination={dataTablePagination}
            />
            <ScrollBar orientation="horizontal"/>
        </ScrollArea>
    );
}

function StateHandlingScrollableDataTable<TData, TValue>(
    {
        columns,
        data,
        onRowSelectionChange,
        dataTablePagination,
        idsLoading,
        dataLoading,
        idsError,
        dataError,
    }: Readonly<DataTableProps<TData, TValue>> & {
        idsLoading?: boolean,
        dataLoading?: boolean,
        idsError?: ApolloError,
        dataError?: ApolloError,
    }
) {
    return (
        <>
            {(idsLoading || dataLoading) && (
                <Skeleton className="w-full h-[400px]"/>
            )}

            {idsError && (
                <Alert className="max-w-max" variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Unable to load firmware IDs.</AlertTitle>
                    <AlertDescription>Error message: "{idsError.message}"</AlertDescription>
                </Alert>
            )}

            {dataError && (
                <Alert className="max-w-max" variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Unable to load firmwares.</AlertTitle>
                    <AlertDescription>Error message: "{dataError.message}"</AlertDescription>
                </Alert>
            )}

            {!idsLoading && !dataLoading && !idsError && !dataError && (
                <ScrollableDataTable
                    columns={columns}
                    data={data}
                    onRowSelectionChange={onRowSelectionChange}
                    dataTablePagination={dataTablePagination}
                />
            )}
        </>
    );
}

export {
    DataTable,
    ScrollableDataTable,
    StateHandlingScrollableDataTable,
}
