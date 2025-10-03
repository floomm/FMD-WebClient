import {BasePage} from "@/pages/base-page.tsx";
import {useParams} from "react-router";
import {useQuery} from "@apollo/client";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useFragment} from "@/__generated__";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {FileAllFragment} from "@/__generated__/graphql.ts";
import {EntityTable} from "@/components/ui/entity-table.tsx";
import {FILE_ALL, GET_FILE_BY_ID} from "@/components/graphql/file.graphql.ts";

export function FilePage() {
    const {fileId} = useParams<{ fileId: string }>();

    const {
        loading: filesLoading,
        data: filesData,
    } = useQuery(GET_FILE_BY_ID, {
        variables: {id: fileId as string},
        skip: !fileId,
    });

    if (!fileId) {
        return (
            <BasePage title={"File (missing ID)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Missing File ID.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }

    if (filesLoading) {
        return (
            <BasePage title="File">
                <Skeleton className="w-full h-[400px]"/>
            </BasePage>
        );
    }

    const files = (filesData?.android_firmware_connection?.edges ?? [])
        .flatMap(firmwareEdge => (firmwareEdge?.node?.firmwareFileIdList?.edges ?? []))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(edge => useFragment(FILE_ALL, edge?.node))
        .filter(isNonNullish)

    if (files.length === 1) {
        const file: FileAllFragment = files[0];

        return (
            <BasePage title="File">
                <EntityTable entity={file}/>
            </BasePage>
        );
    }

    if (files.length < 1) {
        return (
            <BasePage title={"File (no match)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Could not find an file with ID '{fileId}'.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }

    if (files.length > 1) {
        return (
            <BasePage title={"File (multiple matches)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Found multiple files with ID '{fileId}'.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }
}