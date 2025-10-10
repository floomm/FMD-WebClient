import {ImplReportPageProps} from "@/pages/reports/report-page.tsx";
import {useQuery} from "@apollo/client";
import {
    ANDROGUARD_REPORT,
    GET_ANDROGUARD_REPORT_BY_OBJECT_ID,
} from "@/components/graphql/report.graphql.ts";
import {BasePage} from "@/pages/base-page.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useFragment} from "@/__generated__";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {EntityTable} from "@/components/ui/entity-table.tsx";

export function AndroGuardReportPage({reportId}: Readonly<ImplReportPageProps>) {
    const {
        loading: reportsLoading,
        data: reportsData,
    } = useQuery(GET_ANDROGUARD_REPORT_BY_OBJECT_ID, {
        variables: {reportObjectId: reportId},
        skip: !reportId,
    });

    if (reportsLoading) {
        return (
            <BasePage title="Report loading...">
                <Skeleton className="w-full h-[400px]"/>
            </BasePage>
        );
    }

    const reports = (reportsData?.androguard_report_list ?? [])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(report => useFragment(ANDROGUARD_REPORT, report))
        .filter(isNonNullish);

    if (reports.length === 1) {
        const report = reports[0];

        return (
            <BasePage title={`Report (AndroGuard)`}>
                <EntityTable entity={report}/>
            </BasePage>
        );
    }
}