import {useQuery} from "@apollo/client";
import {APKID_REPORT, GET_APKID_REPORT_BY_OBJECT_ID} from "@/components/graphql/report.graphql.ts";
import {useFragment} from "@/__generated__";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {BasePage} from "@/pages/base-page.tsx";
import {EntityTable} from "@/components/ui/entity-table.tsx";
import {jwtDecode} from "jwt-decode";
import {ImplReportPageProps, ReportLoadingPage} from "@/pages/reports/report-page.tsx";
import {ApkidReportFragment} from "@/__generated__/graphql.ts";

function enrichReport(report: ApkidReportFragment, token: string) {
    const decodedJwtHeader = jwtDecode(token, {header: true});

    return {
        ...report,
        decodedJwtHeader,
    };
}

export function ApkidReportPage({reportId}: Readonly<ImplReportPageProps>) {
    const {
        loading: reportsLoading,
        data: reportsData,
    } = useQuery(GET_APKID_REPORT_BY_OBJECT_ID, {
        variables: {reportObjectId: reportId},
        skip: !reportId,
    });

    if (reportsLoading) {
        return (
            <ReportLoadingPage/>
        );
    }

    const reports = (reportsData?.apkid_report_list ?? [])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(report => useFragment(APKID_REPORT, report))
        .filter(isNonNullish);

    const report = reports[0];

    if (report.reportFileJson.data) {
        return (
            <BasePage title={`Report (APKiD)`}>
                <EntityTable entity={enrichReport(report, report.reportFileJson.data)}/>
            </BasePage>
        );
    }

    return (
        <BasePage title={`Report (APKiD)`}>
            <EntityTable entity={report}/>
        </BasePage>
    );
}