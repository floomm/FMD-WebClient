import {useMemo} from "react";
import {useQuery} from "@apollo/client";
import {GET_FIRMWARE_OBJECT_ID_LIST, GET_FIRMWARES_BY_OBJECT_IDS} from "@/components/graphql/firmware.graphql.ts";
import {TypographyH2} from "@/components/typography/headings.tsx";
import {BasePage} from "@/pages/base-page.tsx";
import {Dropzone} from "@/components/importer/dropzone.tsx";
import {DataTable} from "@/components/ui/data-table.tsx";
import {columns, mobileColumns} from "@/components/importer/columns.tsx";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export function ImporterPage() {
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
        <BasePage title="Firmware Import">
            <div className="flex flex-col items-center my-8 mx-4 gap-8">
                <TypographyH2>Upload Firmwares</TypographyH2>
                <Dropzone/>

                <Separator></Separator>
                <TypographyH2>Extracted Firmwares</TypographyH2>

                {(idsLoading || (objectIds.length > 0 && firmwaresLoading)) && (
                    <Skeleton className="w-full max-w-3xl h-[100px]"></Skeleton>
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
                    <DataTable
                        columns={columns}
                        mobileColumns={mobileColumns}
                        data={firmwares}
                    />
                )}
            </div>
        </BasePage>
    );
}
