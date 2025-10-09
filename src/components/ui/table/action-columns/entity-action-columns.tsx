import type {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {BookOpenIcon, EyeIcon} from "lucide-react";
import {DELETE_FIRMWARE_BY_OBJECT_ID} from "@/components/graphql/firmware.graphql.ts";
import {useNavigate} from "react-router";
import {
    Exact,
    Scalars,
    ScanApksByFirmwareObjectIdsMutation,
    ScanApksByObjectIdsMutation
} from "@/__generated__/graphql.ts";
import {TypedDocumentNode} from "@graphql-typed-document-node/core";
import {
    ActionButton,
    DeleteEntityButton,
    ScanAppActionButton
} from "@/components/ui/table/action-columns/action-buttons.tsx";
import {APPS_URL, FILES_URL, FIRMWARES_URL} from "@/components/ui/sidebar/app-sidebar.tsx";

type WithId = { id: string };
type WithIdAndFirmwareIdReference = {
    id: string;
    firmwareIdReference?: {
        __typename?: "AndroidFirmwareType"
        id: string
    } | null;
};
export type WithTypenameMutation = { __typename?: "Mutation" };

function buildSelectEntityColumn<T extends WithId>(): ColumnDef<T> {
    return (
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    className="flex items-center"
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    className="flex items-center"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                />
            ),
        }
    );
}

function buildViewFirmwareColumn<T extends WithId>(): ColumnDef<T> {
    return (
        {
            id: "view",
            cell: ({row}) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigate = useNavigate();
                const firmwareId = row.original.id;

                return (
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                            <ActionButton
                                variant="outline"
                                onClick={() => void navigate(`${FIRMWARES_URL}/${firmwareId}`)}
                            >
                                <EyeIcon className="size-5"/>
                            </ActionButton>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View firmware</p>
                        </TooltipContent>
                    </Tooltip>
                );
            },
        }
    );
}

function buildViewAppColumn<T extends WithIdAndFirmwareIdReference>(): ColumnDef<T> {
    return (
        {
            id: "view",
            cell: ({row}) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigate = useNavigate();
                const appId = row.original.id;
                const firmwareId = row.original.firmwareIdReference?.id;

                return (
                    <>
                        {firmwareId && (
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <ActionButton
                                        variant="outline"
                                        onClick={() => void navigate(`${FIRMWARES_URL}/${firmwareId}${APPS_URL}/${appId}`)}
                                    >
                                        <EyeIcon className="size-5"/>
                                    </ActionButton>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View app</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </>
                );
            },
        }
    );
}

function buildViewFileColumn<T extends WithIdAndFirmwareIdReference>(): ColumnDef<T> {
    return (
        {
            id: "view",
            cell: ({row}) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigate = useNavigate();
                const fileId = row.original.id;
                const firmwareId = row.original.firmwareIdReference?.id;

                return (
                    <>
                        {firmwareId && (
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <ActionButton
                                        variant="outline"
                                        onClick={() => void navigate(`${FIRMWARES_URL}/${firmwareId}${FILES_URL}/${fileId}`)}
                                    >
                                        <EyeIcon className="size-5"/>
                                    </ActionButton>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View file</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </>
                );
            },
        }
    );
}

function buildViewReportsColumn<T extends WithIdAndFirmwareIdReference>(): ColumnDef<T> {
    return (
        {
            id: "view-reports",
            cell: ({row}) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigate = useNavigate();
                const appId = row.original.id;
                const firmwareId = row.original.firmwareIdReference?.id;

                return (
                    <>
                        {firmwareId && (
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <ActionButton
                                        variant="outline"
                                        onClick={() => void navigate(`${FIRMWARES_URL}/${firmwareId}${APPS_URL}/${appId}/reports`)}
                                    >
                                        <BookOpenIcon className="size-5"/>
                                    </ActionButton>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View reports</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </>
                );
            }
        }
    );
}

function buildDeleteEntityColumn<T extends WithId, U extends WithTypenameMutation>(
    tooltipSingle: string,
    tooltipSelected: string,
    deleteMutation: TypedDocumentNode<U, Exact<{
        objectIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
    }>>
): ColumnDef<T> {
    return (
        {
            id: "delete",
            header: ({table}) =>
                <DeleteEntityButton<U>
                    ids={table.getSelectedRowModel().flatRows.map(row => row.original.id)}
                    tooltip={tooltipSelected}
                    deleteMutation={deleteMutation}
                />,
            cell: ({row}) =>
                <DeleteEntityButton
                    ids={[row.original.id]}
                    tooltip={tooltipSingle}
                    deleteMutation={deleteMutation}
                />
        }
    );
}

function buildScanAppColumn<T extends WithId>(
    tooltipSingle: string,
    tooltipSelected: string,
    scanMutation: TypedDocumentNode<ScanApksByObjectIdsMutation | ScanApksByFirmwareObjectIdsMutation, Exact<{
        objectIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
        scannerName: Scalars["String"]["input"]
    }>>,
): ColumnDef<T> {
    return (
        {
            id: "scan",
            header: ({table}) =>
                <ScanAppActionButton
                    ids={table.getSelectedRowModel().flatRows.map(row => row.original.id)}
                    tooltip={tooltipSelected}
                    mutation={scanMutation}
                />,
            cell: ({row}) =>
                <ScanAppActionButton
                    ids={[row.original.id]}
                    tooltip={tooltipSingle}
                    mutation={scanMutation}
                />,
        }
    );
}

function buildFirmwareActionColumns<T extends WithId>(
    scanAppMutation: TypedDocumentNode<ScanApksByFirmwareObjectIdsMutation, Exact<{
        objectIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
        scannerName: Scalars["String"]["input"]
    }>>,
): ColumnDef<T>[] {
    return [
        buildSelectEntityColumn(),
        buildViewFirmwareColumn(),
        buildScanAppColumn("Scan all apps of this firmware", "Scan all apps of selected firmwares", scanAppMutation),
        buildDeleteEntityColumn("Delete firmware", "Delete selected firmwares", DELETE_FIRMWARE_BY_OBJECT_ID),
    ];
}

function buildAppActionColumns<T extends WithIdAndFirmwareIdReference>(
    scanAppMutation: TypedDocumentNode<ScanApksByObjectIdsMutation, Exact<{
        objectIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
        scannerName: Scalars["String"]["input"]
    }>>,
): ColumnDef<T> [] {
    return [
        buildSelectEntityColumn(),
        buildViewAppColumn(),
        buildViewReportsColumn(),
        buildScanAppColumn("Scan app", "Scan selected apps", scanAppMutation),
    ];
}

function buildFileActionColumns<T extends WithIdAndFirmwareIdReference>(): ColumnDef<T> [] {
    return [
        buildSelectEntityColumn(),
        buildViewFileColumn(),
    ];
}

export {
    buildSelectEntityColumn,
    buildFirmwareActionColumns,
    buildAppActionColumns,
    buildFileActionColumns,
}
