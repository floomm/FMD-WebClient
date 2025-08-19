import {TypographyH2} from "@/components/ui/typography/headings.tsx";
import {BasePage} from "@/pages/base-page.tsx";
import {Dropzone} from "@/components/ui/importer/dropzone.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {Firmware, FirmwareDataTable} from "@/components/ui/firmware/firmware-data-table.tsx";
import {useMutation} from "@apollo/client";
import {CREATE_FIRMWARE_EXTRACTOR_JOB} from "@/components/graphql/firmware.graphql.ts";

export function ImporterPage() {
    const [createFirmwareExtractorJob, {loading: extractorJobLoading}] = useMutation(CREATE_FIRMWARE_EXTRACTOR_JOB);

    return (
        <BasePage title="Firmware Import">
            <div className="flex flex-col items-center mx-4 my-8 gap-8">
                <TypographyH2>Upload Firmwares</TypographyH2>
                <Dropzone/>
                <Separator></Separator>
                <TypographyH2>Uploaded Firmwares</TypographyH2>
                <p className="italic">TODO: List with uploaded firmwares</p>
                <Button
                    onClick={() => createFirmwareExtractorJob({variables: {storageIndex: 0}})}
                    disabled={extractorJobLoading}
                >
                    Extract Firmwares
                </Button>
                <Separator></Separator>
                <TypographyH2>Extracted Firmwares</TypographyH2>
                <FirmwareDataTable columns={columns} mobileColumns={mobileColumns}/>
            </div>
        </BasePage>
    );
}

const columns: ColumnDef<Firmware>[] = [
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
            return `${date.getFullYear().toString()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())} ${padStart(date.getHours())}:${padStart(date.getMinutes())}`;
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

const mobileColumns: ColumnDef<Firmware>[] = [
    {
        accessorKey: "originalFilename",
        header: "Original Filename",
    },
]
