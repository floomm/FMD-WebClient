import type {ColumnDef, Table} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button, buttonVariants} from "@/components/ui/button.tsx";
import {EyeIcon, LoaderCircle, LoaderCircleIcon, ScanSearchIcon, TrashIcon} from "lucide-react";
import {useLazyQuery, useMutation} from "@apollo/client";
import {DELETE_FIRMWARE_BY_OBJECT_ID} from "@/components/graphql/firmware.graphql.ts";
import {convertIdToObjectId} from "@/lib/graphql/graphql-utils.ts";
import {useNavigate, useParams} from "react-router";
import {GET_RQ_JOB_LIST} from "@/components/graphql/rq-job.graphql.ts";
import {Exact, GetRqJobListQuery, Scalars} from "@/__generated__/graphql.ts";
import {TypedDocumentNode} from "@graphql-typed-document-node/core";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import * as React from "react";
import type {VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils.ts";
import {Scanner, ScannersTable} from "@/components/ui/scanners-table.tsx";
import {SCAN_APKS_BY_OBJECT_IDS} from "@/components/graphql/app.graphql.ts";
import {useState} from "react";

type WithId = { id: string };
type WithTypenameMutation = { __typename?: "Mutation" };

const DELETION_JOB_FUNC_NAME = "api.v2.types.GenericDeletion.delete_queryset_background";

function isDeletionOngoing(objectIds: string[], rqJobListData: GetRqJobListQuery | undefined) {
    const ongoingDeletionJobs = rqJobListData?.rq_job_list
        ?.filter(job =>
            job?.funcName === DELETION_JOB_FUNC_NAME &&
            !job.isFinished &&
            !job.isFailed
        ).filter(job => {
            if (!job?.description) return false;

            /*
            The job description contains the affected elements in the following format:
            "api.v2.types.GenericDeletion.delete_queryset_background(['68d2c1f78773bc31564c1dab', '68d2c2008773bc31564c1dac'], <class 'model.AndroidFirmware.AndroidFirmware'>)",
             */
            const start = job.description.indexOf("['");
            const end = job.description.indexOf("']");
            const deletedObjectIdsSubstring = job.description.substring(start, end + 2);
            // We parse the substring to a string array. But first, we need to replace both ' with ".
            const deletedObjectIds = JSON.parse(deletedObjectIdsSubstring.replace(/'/g, '"')) as string[];
            return objectIds.some((id) => deletedObjectIds.includes(id));
        });

    return (ongoingDeletionJobs?.length ?? 0) > 0;
}

function ActionButton(
    {
        className,
        variant,
        asChild = false,
        ...props
    }: React.ComponentProps<"button"> &
        VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    return (
        <Button
            className={cn(className, "p-0 has-[>svg]:p-0 w-9")}
            variant={variant}
            asChild={asChild}
            {...props}
        ></Button>
    );
}

function DeleteSelectedButton<T extends WithId, U extends WithTypenameMutation>(
    {
        tooltip,
        table,
        deleteMutation,
    }: Readonly<{
        tooltip: string;
        table: Table<T>;
        deleteMutation: TypedDocumentNode<U, Exact<{
            objectIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
        }>>;
    }>,
) {
    const selectedObjectIds = table.getSelectedRowModel().rows.map((row) => convertIdToObjectId(row.original.id));
    const [deleteEntities] = useMutation(deleteMutation, {
        variables: {objectIds: selectedObjectIds},
    });

    const [getRqJobList, {data: rqJobListData}] = useLazyQuery(GET_RQ_JOB_LIST, {
        fetchPolicy: "cache-and-network",
        pollInterval: 5000,
    });

    if (isDeletionOngoing(selectedObjectIds, rqJobListData)) {
        return (
            <LoaderCircleIcon className="animate-spin"></LoaderCircleIcon>
        );
    }

    const disabled = selectedObjectIds.length === 0;

    return (
        <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
                <ActionButton
                    variant="destructive"
                    disabled={disabled}
                    onClick={() => {
                        void deleteEntities();
                        void getRqJobList();
                    }}
                >
                    <TrashIcon/>
                </ActionButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    )
}

function DeleteEntityButton<T extends WithTypenameMutation>(
    {
        tooltip,
        id,
        deleteMutation,
    }: Readonly<{
        tooltip: string;
        id: string;
        deleteMutation: TypedDocumentNode<T, Exact<{
            objectIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
        }>>;
    }>,
) {
    const objectId = convertIdToObjectId(id);
    const [deleteEntity] = useMutation(
        deleteMutation, {
            variables: {
                objectIds: objectId,
            }
        }
    );

    const [getRqJobList, {data: rqJobListData}] = useLazyQuery(GET_RQ_JOB_LIST, {
        fetchPolicy: "cache-and-network",
        pollInterval: 5000,
    });

    if (isDeletionOngoing([objectId], rqJobListData)) {
        return (
            <div className="flex items-center justify-center">
                <LoaderCircle className="animate-spin"></LoaderCircle>
            </div>
        );
    }

    return (
        <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
                <ActionButton
                    variant="destructive"
                    onClick={() => {
                        void deleteEntity();
                        void getRqJobList();
                    }}
                >
                    <TrashIcon/>
                </ActionButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    )
        ;
}

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

function buildViewEntityColumn<T extends WithId>(
    tooltip: string,
    basePath: string,
): ColumnDef<T> {
    return (
        {
            id: "view",
            cell: ({row}) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigate = useNavigate();
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const {firmwareId} = useParams<{ firmwareId?: string }>();
                const rowOriginalId = row.original.id;

                return (
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                            <ActionButton
                                variant="outline"
                                onClick={() => {
                                    if (basePath === "/apps" && firmwareId) {
                                        void navigate(`/firmwares/${firmwareId}${basePath}/${rowOriginalId}`);
                                    } else {
                                        void navigate(`${basePath}/${rowOriginalId}`);
                                    }
                                }}
                            >
                                <EyeIcon className="size-5"/>
                            </ActionButton>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            },
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
            header: ({table}) => <DeleteSelectedButton<T, U> tooltip={tooltipSelected} table={table}
                                                             deleteMutation={deleteMutation}/>,
            cell: ({row}) => <DeleteEntityButton tooltip={tooltipSingle} id={row.original.id}
                                                 deleteMutation={deleteMutation}/>,
        }
    );
}

function ScanApkButton(
    {
        ids,
        tooltip,
    }: Readonly<{
        ids: string[];
        tooltip: string;
    }>,
) {
    const [selectedScanners, setSelectedScanners] = useState<Scanner[]>([]);
    const [scanApk] = useMutation(SCAN_APKS_BY_OBJECT_IDS);

    return (
        <Dialog modal={true}>
            <DialogTrigger>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <ActionButton variant="outline" disabled={ids.length <= 0}>
                            <ScanSearchIcon className="size-5"/>
                        </ActionButton>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Select Scanner(s)</DialogTitle>
                </DialogHeader>
                <ScannersTable setSelectedScanners={setSelectedScanners}/>
                <DialogFooter>
                    <Button onClick={() => {
                        selectedScanners.forEach((scanner) => void scanApk({
                            variables: {
                                objectIds: ids.map(id => convertIdToObjectId(id)),
                                scannerName: scanner.id
                            }
                        }));
                    }}>Start Scan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function buildScanApkColumn<T extends WithId>(): ColumnDef<T> {
    return (
        {
            id: "scan",
            header: ({table}) =>
                <ScanApkButton
                    ids={table.getSelectedRowModel().flatRows.map(row => row.original.id)}
                    tooltip="Scan selected apps"
                />,
            cell: ({row}) =>
                <ScanApkButton
                    ids={[row.original.id]}
                    tooltip="Scan app"
                />,
        }
    );
}

function buildFirmwareActionColumns<T extends WithId>(): ColumnDef<T>[] {
    return [
        buildSelectEntityColumn(),
        buildViewEntityColumn("View firmware", "/firmwares"),
        buildDeleteEntityColumn("Delete firmware", "Delete selected firmwares", DELETE_FIRMWARE_BY_OBJECT_ID),
    ];
}

function buildAppActionColumns<T extends WithId>(): ColumnDef<T>[] {
    return [
        buildSelectEntityColumn(),
        buildViewEntityColumn("View app", "/apps"),
        buildScanApkColumn(),
    ];
}

export {
    buildSelectEntityColumn,
    buildViewEntityColumn,
    buildDeleteEntityColumn,
    buildFirmwareActionColumns,
    buildAppActionColumns,
}
