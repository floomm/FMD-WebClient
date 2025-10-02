import {BasePage} from "@/pages/base-page.tsx";
import {RqJobsTable} from "@/components/ui/rq-jobs-table.tsx";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";

export function ScannerPage() {
    const navigate = useNavigate();

    return (
        <BasePage title="Recent App Scan Jobs">
            <Alert className="flex items-center justify-center max-w-5xl">
                <AlertCircleIcon/>
                <AlertTitle className="flex items-center justify-center flex-wrap">
                    If you wish to start new scans, navigate to the
                    <Button onClick={() => void navigate("/firmwares")} className="px-1 py-0" variant="link">Firmwares</Button>
                    or
                    <Button onClick={() => void navigate("/apps")} className="px-1 py-0" variant="link">Apps</Button>
                    page.
                </AlertTitle>
            </Alert>
            <div className="flex items-center justify-center w-full max-w-7xl">
                <RqJobsTable funcNames={["start_scan"]}/>
            </div>
        </BasePage>
    );
}
