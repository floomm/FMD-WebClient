import {BasePage} from "@/pages/base-page.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {ReportInfoWithAppReferenceFragment} from "@/__generated__/graphql.ts";
import {StateHandlingScrollableDataTable} from "@/components/ui/table/data-table.tsx";
import {useQuery} from "@apollo/client";
import {useFragment} from "@/__generated__";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {GET_ALL_REPORTS, REPORT_INFO_WITH_APP_REFERENCE} from "@/components/graphql/report.graphql.ts";

const columns: ColumnDef<ReportInfoWithAppReferenceFragment>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "androidAppIdReference.filename",
        header: "App Filename",
    },
    {
        accessorKey: "scannerName",
        header: "Scanner Name",
    },
    {
        accessorKey: "scannerVersion",
        header: "Scanner Version",
    },
    {
        accessorKey: "reportDate",
        header: "Report Date",
    },
];

export function ReportsPage() {
    const {
        loading: reportsLoading,
        error: reportsError,
        data: reportsData,
    } = useQuery(GET_ALL_REPORTS, {
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