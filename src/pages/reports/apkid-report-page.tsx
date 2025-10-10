import {useQuery} from "@apollo/client";
import {APKID_REPORT, GET_APKID_REPORT_BY_OBJECT_ID} from "@/components/graphql/report.graphql.ts";
import {useFragment} from "@/__generated__";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {BasePage} from "@/pages/base-page.tsx";
import {EntityTable} from "@/components/ui/entity-table.tsx";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {jwtDecode} from "jwt-decode";

type ApkidReportPageProps = {
    reportId: string;
}

export function ApkidReportPage(
    {
        reportId,
    }: Readonly<ApkidReportPageProps>) {
    const {
        loading: reportsLoading,
        data: reportsData,
    } = useQuery(GET_APKID_REPORT_BY_OBJECT_ID, {
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

    const reports = (reportsData?.apkid_report_list ?? [])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(report => useFragment(APKID_REPORT, report))
        .filter(isNonNullish);

    if (reports.length === 1) {
        const report = reports[0];

        if (report.reportFileJson.data) {
            const token = report.reportFileJson.data;
            const decodedJwtHeader = jwtDecode(token, {header: true});

            const enrichedReport = {
                ...report,
                decodedJwtHeader,
            };

            return (
                <BasePage title={`Report (APKiD)`}>
                    <EntityTable entity={enrichedReport}/>
                </BasePage>
            );
        }

        return (
            <BasePage title={`Report (APKiD)`}>
                <EntityTable entity={report}/>
            </BasePage>
        );
    }

    if (reports.length < 1) {
        return (
            <BasePage title={"Report (no match)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Could not find a report with ID '{reportId}'.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }

    if (reports.length > 1) {
        return (
            <BasePage title={"Report (multiple matches)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Found multiple reports with ID '{reportId}'.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }
}