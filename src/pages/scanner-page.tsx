import {BasePage} from "@/pages/base-page.tsx";
import {CheckboxForm} from "@/components/ui/checkbox-form.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {StateHandlingScrollableDataTable} from "@/components/ui/table/data-table.tsx";
import {useQuery} from "@apollo/client";
import {
    FIRMWARE_ROW_SCANNER_PAGE,
    GET_FIRMWARES_SCANNER_PAGE,
} from "@/components/graphql/firmware.graphql.ts";
import {
    AppRowScannerPageFragment,
    FirmwareRowScannerPageFragment,
} from "@/__generated__/graphql.ts";
import {useFragment} from "@/__generated__";
import {
    APP_ROW_SCANNER_PAGE,
    GET_APPS_SCANNER_PAGE
} from "@/components/graphql/app.graphql.ts";
import {buildSelectEntityColumn} from "@/components/ui/entity-action-columns.tsx";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {Stepper} from "@/components/ui/stepper.tsx";
import {TypographyH4} from "@/components/ui/typography/headings.tsx";

export function ScannerPage() {
    return (
        <BasePage title="App Scanner">
            <Stepper
                className="w-full"
                stepComponents={[
                    FirmwaresPanel(),
                    AppsPanel(),
                    ScannersPanel(),
                ]}
                numberOfSteps={3}
                stepLabels={[
                    "Firmwares",
                    "Apps",
                    "Scanners",
                ]}
            />
        </BasePage>
    );
}

function FirmwaresPanel() {
    const columns: ColumnDef<FirmwareRowScannerPageFragment>[] = [
        buildSelectEntityColumn<FirmwareRowScannerPageFragment>(),
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "originalFilename",
            header: "Original Filename",
        },
    ];

    const {
        loading: firmwaresLoading,
        error: firmwaresError,
        data: firmwaresData,
    } = useQuery(GET_FIRMWARES_SCANNER_PAGE);

    const firmwares = (firmwaresData?.android_firmware_connection?.edges ?? [])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(edge => useFragment(FIRMWARE_ROW_SCANNER_PAGE, edge?.node))
        .filter(isNonNullish)

    return (
        <div className="flex flex-col px-2 gap-4">
            <TypographyH4>Select firmwares</TypographyH4>
            <StateHandlingScrollableDataTable
                columns={columns}
                data={firmwares}
                dataLoading={firmwaresLoading}
                dataError={firmwaresError}
            />
        </div>
    );
}

function AppsPanel() {
    const columns: ColumnDef<AppRowScannerPageFragment>[] = [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    className="flex items-center"
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    className="flex items-center"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                />
            ),
        },
        {
            accessorKey: "id",
            header: "ID",
        }
    ];

    const {
        loading: appsLoading,
        error: appsError,
        data: appsData,
    } = useQuery(GET_APPS_SCANNER_PAGE);

    const apps = (appsData?.android_firmware_connection?.edges ?? [])
        .flatMap(firmwareEdge => (firmwareEdge?.node?.androidAppIdList?.edges ?? []))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(edge => useFragment(APP_ROW_SCANNER_PAGE, edge?.node))
        .filter(isNonNullish)

    return (
        <div className="flex flex-col px-2 gap-4">
            <TypographyH4>Select apps</TypographyH4>
            <StateHandlingScrollableDataTable
                columns={columns}
                data={apps}
                dataLoading={appsLoading}
                dataError={appsError}
            />
        </div>
    );
}

function ScannersPanel() {
    const scanners = [
        "AndroGuard",
        "APKiD",
        "APKLeaks",
        "APKscan",
        "Exodus-Core",
        "FlowDroid",
        "MobSFScan",
        "Trueseeing",
        "Quark-Engine",
        "Qark",
        "Androwarn",
        "SUPER Android Analyzer",
    ];

    return (
        <div className="flex flex-col px-2 gap-4">
            <TypographyH4>Select scanners</TypographyH4>
            <CheckboxForm
                items={scanners.map((scanner) => ({
                    id: scanner,
                    label: scanner,
                }))}
                validateOnMount={true}
                validationMode="onChange"
            />
        </div>
    );
}