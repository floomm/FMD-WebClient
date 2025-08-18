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
