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

// ----------------------------------------------------------------------------------------------------
// APKiD REPORT
// ----------------------------------------------------------------------------------------------------

export const APKID_REPORT = gql(`
    fragment ApkidReport on ApkidReportType {
        id
        files
        rulesSha256
        reportFileJson {
            data
        }
        reportDate
        scannerName
        scannerVersion
    }
`);

export const GET_APKID_REPORT_BY_OBJECT_ID = gql(`
    query GetApkidReportByObjectId($reportObjectId: String) {
        apkid_report_list(objectIdList: [$reportObjectId]) {
            ...ApkidReport
        }
    }
`);

// ----------------------------------------------------------------------------------------------------
// AndroGuard REPORT
// ----------------------------------------------------------------------------------------------------

export const ANDROGUARD_REPORT = gql(`
    fragment AndroguardReport on AndroGuardReportType {
        id
        activities
        androidVersionCode
        androidVersionName
        appName
        dexNames
        effectiveTargetVersion
        fileNameList
        intentFiltersDict
        isAndroidtv
        isLeanback
        isMultidex
        isSignedV1
        isSignedV2
        isSignedV3
        isValidApk
        isWearable
        mainActivity
        mainActivityList
        manifestFeatures
        manifestLibraries
        manifestXml
        maxSdkVersion
        minSdkVersion
        packagename
        permissionDetails
        permissions
        permissionsDeclared
        permissionsDeclaredDetails
        permissionsImplied
        permissionsRequestedThirdParty
        providers
        receivers
        services
        signatureNames
        targetSdkVersion
        reportDate
        scannerName
        scannerVersion
    }
`);

export const GET_ANDROGUARD_REPORT_BY_OBJECT_ID = gql(`
    query GetAndroguardReportByObjectId($reportObjectId: String) {
        androguard_report_list(objectIdList: [$reportObjectId]) {
            ...AndroguardReport
        }
    }
`);

// ----------------------------------------------------------------------------------------------------
// Exodus REPORT
// ----------------------------------------------------------------------------------------------------

export const EXODUS_REPORT = gql(`
    fragment ExodusReport on ExodusReportType {
        id
        results
        reportDate
        scannerName
        scannerVersion
    }
`);

export const GET_EXODUS_REPORT_BY_OBJECT_ID = gql(`
    query GetExodusReportByObjectId($reportObjectId: String) {
        exodus_report_list(objectIdList: [$reportObjectId]) {
            ...ExodusReport
        }
    }
`);
