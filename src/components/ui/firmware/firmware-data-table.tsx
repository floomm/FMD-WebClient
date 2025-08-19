import {ColumnDef} from "@tanstack/react-table";
import {useQuery} from "@apollo/client";
import {useMemo} from "react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx";
import {DataTable} from "@/components/ui/data-table.tsx";
import {GET_FIRMWARE_OBJECT_ID_LIST, GET_FIRMWARES_BY_OBJECT_IDS} from "@/components/graphql/firmware.graphql.ts";

export type Firmware = {
    id: string;
    indexedDate?: Date;
    originalFilename?: string;
    osVendor?: string;
    versionDetected?: number | null;
}

type FirmwareDataTableProps = {
    columns: ColumnDef<Firmware>[];
    mobileColumns?: ColumnDef<Firmware>[];
}

export function FirmwareDataTable({columns, mobileColumns}: Readonly<FirmwareDataTableProps>) {
    const {
        data: idsData,
        loading: idsLoading,
        error: idsError,
    } = useQuery(GET_FIRMWARE_OBJECT_ID_LIST);

    const objectIds = useMemo(() =>
            (idsData?.android_firmware_id_list ?? []).filter(Boolean) as string[],
        [idsData]
    );

    const {
        data: firmwaresData,
        loading: firmwaresLoading,
        error: firmwaresError,
    } = useQuery(GET_FIRMWARES_BY_OBJECT_IDS, {
        variables: {objectIds},
        skip: objectIds.length === 0,
        fetchPolicy: "cache-and-network",
    });

    const firmwares =
        firmwaresData?.android_firmware_list?.filter(fw => fw !== null) ?? [];

    return (
        <>
            {(idsLoading || firmwaresLoading) && (
                <Skeleton className="w-full h-[150px]"></Skeleton>
            )}

            {idsError && (
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Failed to load firmware IDs.</AlertTitle>
                </Alert>
            )}

            {firmwaresError && (
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Failed to load firmwares.</AlertTitle>
                </Alert>
            )}

            {firmwares.length > 0 && (
                <ScrollArea className="w-full whitespace-nowrap">
                    <DataTable
                        columns={columns}
                        mobileColumns={mobileColumns}
                        data={firmwares}
                    />
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            )}

            {!idsLoading && !firmwaresLoading && !idsError && !firmwaresError && firmwares.length <= 0 && (
                <Alert>
                    <AlertTitle>No firmware found.</AlertTitle>
                </Alert>
            )}
        </>
    );
}
