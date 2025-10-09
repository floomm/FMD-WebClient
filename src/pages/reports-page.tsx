import {BasePage} from "@/pages/base-page.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {ReportInfoWithAppReferenceFragment} from "@/__generated__/graphql.ts";
import {StateHandlingScrollableDataTable} from "@/components/ui/table/data-table.tsx";
import {useQuery} from "@apollo/client";
import {useFragment} from "@/__generated__";
import {convertIdToObjectId, isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {GET_REPORTS_BY_APP_OBJECT_ID, REPORT_INFO_WITH_APP_REFERENCE} from "@/components/graphql/report.graphql.ts";
import {useParams} from "react-router";
import {buildViewReportColumn} from "@/components/ui/table/action-columns/report-action-columns.tsx";

const columns: ColumnDef<ReportInfoWithAppReferenceFragment>[] = [
    buildViewReportColumn<ReportInfoWithAppReferenceFragment>(),
    {
        id: "id",
        accessorKey: "id",
        header: "ID",
        meta: {hidden: true},
    },
    {
        id: "scannerName",
        accessorKey: "scannerName",
        header: "Scanner Name",
    },
    {
        id: "scannerVersion",
        accessorKey: "scannerVersion",
        header: "Scanner Version",
    },
    {
        id: "reportDate",
        accessorKey: "reportDate",
        header: "Report Date",
    },
    {
        id: "androidAppIdReference.filename",
        accessorKey: "androidAppIdReference.filename",
        header: "App Filename",
    },
];

export function ReportsPage() {
    const {appId} = useParams<{ appId?: string }>();

    let appObjectId: string | undefined;
    if (appId) {
        appObjectId = convertIdToObjectId(appId);
    }

    const {
        loading: reportsLoading,
        error: reportsError,
        data: reportsData,
    } = useQuery(GET_REPORTS_BY_APP_OBJECT_ID, {
        variables: {appObjectId: appObjectId},
        fetchPolicy: "cache-first",
    });

    const reports = (reportsData?.apk_scanner_report_list ?? [])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(report => useFragment(REPORT_INFO_WITH_APP_REFERENCE, report))
        .filter(isNonNullish);

    return (
        <BasePage title={"Reports"}>
            <StateHandlingScrollableDataTable
                columns={columns}
                data={reports}
                dataLoading={reportsLoading}
                dataError={reportsError}
            />
        </BasePage>
    );
}