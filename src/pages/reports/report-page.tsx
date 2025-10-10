import {BasePage} from "@/pages/base-page.tsx";
import {useParams} from "react-router";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {ApkidReportPage} from "@/pages/reports/apkid-report-page.tsx";

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
        case "APKiD":
            return (
                <>
                    <ApkidReportPage reportId={reportId}/>
                </>
            );
    }
}