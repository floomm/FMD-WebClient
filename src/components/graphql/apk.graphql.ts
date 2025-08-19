import {gql} from "@/__generated__";

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