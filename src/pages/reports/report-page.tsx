import {BasePage} from "@/pages/base-page.tsx";
import {useParams} from "react-router";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {ApkidReportPage} from "@/pages/reports/apkid-report-page.tsx";
import {AndroGuardReportPage} from "@/pages/reports/andro-guard-report-page.tsx";

export type ImplReportPageProps = {
    reportId: string;
}

export function ReportPage() {
    const {scannerNameAndReportId} = useParams<{ scannerNameAndReportId: string; }>();

    if (!scannerNameAndReportId) {
        return (
            <BasePage title={"Unexpected Error"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Failed to identify the requested report.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }

    const [scannerName, reportId] = scannerNameAndReportId.split("-");

    switch (scannerName) {
        case "AndroGuard":
            return (
                <AndroGuardReportPage reportId={reportId}/>
            );
        case "APKiD":
            return (
                <ApkidReportPage reportId={reportId}/>
            );
        default:
            return (
                <BasePage title="Unknown Report Type">
                    <Alert variant="destructive">
                        <AlertCircleIcon/>
                        <AlertTitle>Scanner/Report type '{scannerName}' is unknown or has not been implemented by the
                            FMD web frontend.</AlertTitle>
                    </Alert>
                </BasePage>
            );

    }
}