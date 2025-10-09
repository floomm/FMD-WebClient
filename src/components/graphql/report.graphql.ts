import {gql} from "@/__generated__";

export const REPORT_INFO_WITH_APP_REFERENCE = gql(`
    fragment ReportInfoWithAppReference on ApkScannerReportType {
        id
        reportDate
        scannerName
        scannerVersion
        androidAppIdReference {
            id
            filename
        }
    }
`);

export const GET_ALL_REPORTS = gql(`
    query GetAllReports {
        apk_scanner_report_list {
            ...ReportInfoWithAppReference
        }
    }
`);