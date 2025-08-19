import {gql} from "@/__generated__";

export const CREATE_FIRMWARE_EXTRACTOR_JOB = gql(`
    mutation CreateFirmwareExtractorJob($storageIndex: Int!) {
        createFirmwareExtractorJob(
            createFuzzyHashes: false
            queueName: "high-python"
            storageIndex: $storageIndex
        ) {
            jobId
        }
    }
`);

export const GET_FIRMWARE_OBJECT_ID_LIST = gql(`
    query GetFirmwareObjectIdList {
        android_firmware_id_list
    }
`);

export const GET_FIRMWARES_BY_OBJECT_IDS = gql(`
    query GetFirmwaresByObjectIds($objectIds: [String!]!) {
        android_firmware_list(objectIdList: $objectIds) {
            id
            indexedDate
            originalFilename
            osVendor
            versionDetected
        }
    }
`);
