import {ColumnDef} from "@tanstack/react-table"

export type Firmware = {
    indexedDate?: Date
    originalFilename: string
    osVendor: string
    versionDetected?: number | null
}

export const columns: ColumnDef<Firmware>[] = [
    {
        accessorKey: "originalFilename",
        header: "Original Filename",
    },
    {
        accessorKey: "indexedDate",
        header: "Indexed Date",
        cell: ({row}) => {
            const padStart = (value: number): string =>
                value.toString().padStart(2, "0");

            const date: Date = new Date(row.getValue("indexedDate"));
            return `
            ${date.getFullYear().toString()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())} ${padStart(date.getHours())}:${padStart(date.getMinutes())}`;
        }
    },
    {
        accessorKey: "osVendor",
        header: "OS Vendor",
    },
    {
        accessorKey: "versionDetected",
        header: "Android Version",
    },
];

export const mobileColumns: ColumnDef<Firmware>[] = [
    {
        accessorKey: "originalFilename",
        header: "Original Filename",
    },
]
