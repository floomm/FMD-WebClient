import {gql} from "@/__generated__";

// ----------------------------------------------------------------------------------------------------
// APP IMPORT
// ----------------------------------------------------------------------------------------------------

export const CREATE_APP_IMPORT_JOB = gql(`
    mutation CreateAppImportJob($storageIndex: Int!) {
        createAppImportJob(
            queueName: "high-python",
            storageIndex: $storageIndex
        ) {
            jobId
        }
    }
`);

// ----------------------------------------------------------------------------------------------------
// GET APPS (ALL FIELDS)
// ----------------------------------------------------------------------------------------------------

// TODO

// ----------------------------------------------------------------------------------------------------
// GET APPS FOR SCANNER PAGE
// ----------------------------------------------------------------------------------------------------

export const APP_ROW_SCANNER_PAGE = gql(`
    fragment AppRowScannerPage on AndroidAppType {
        id
    }
`);

export const GET_APPS_SCANNER_PAGE = gql(`
    query GetAppsScannerPage {
        android_firmware_connection {
            edges {
                node {
                    androidAppIdList {
                        edges {
                            node {
                                ...AppRowScannerPage
                            }
                        }
                    }
                }
            }
        }
    }
`);

// ----------------------------------------------------------------------------------------------------
// APK SCAN
// ----------------------------------------------------------------------------------------------------

export const CREATE_APK_SCAN_JOB = gql(`
    mutation CreateApkScanJob($objectIds: [String!]!, $scannerName: String!) {
        createApkScanJob(
            moduleName: $scannerName
            objectIdList: $objectIds
            queueName: "high-python"
        ) {
            jobIdList
        }
    }
`);