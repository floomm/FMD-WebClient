import {gql} from "@/__generated__";

export const REPORT_INFO = gql(`
    fragment ReportInfo on ApkScannerReportType {
        id
        reportDate
        scannerName
        scannerVersion
        androidAppIdReference {
            id
            filename
            firmwareIdReference {
                id
            }
        }
    }
`);

export const GET_REPORTS_BY_APP_OBJECT_ID = gql(`
    query GetReportsByAppObjectId($appObjectId: String) {
        apk_scanner_report_list(fieldFilter: {android_app_id_reference: $appObjectId}) {
            ...ReportInfo
        }
    }
`);