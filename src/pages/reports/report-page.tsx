import {BasePage} from "@/pages/base-page.tsx";
import {useParams} from "react-router";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {ApkidReportPage} from "@/pages/reports/apkid-report-page.tsx";

export function ReportPage() {
    const {scannerName, reportId} = useParams<{ scannerName: string; reportId: string; }>();

    if (!reportId) {
        return (
            <BasePage title={"Report (missing ID)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Missing Report ID.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }

    switch (scannerName) {
        case "APKiD":
            return (
                <>
                    <ApkidReportPage reportId={reportId}/>
                </>
            );
    }
}