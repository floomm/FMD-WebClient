import {ColumnDef} from "@tanstack/react-table";
import {AppAllFragment} from "@/__generated__/graphql.ts";
import {useQuery} from "@apollo/client";
import {useFragment} from "@/__generated__";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {BasePage} from "@/pages/base-page.tsx";
import {StateHandlingScrollableDataTable} from "@/components/ui/table/data-table.tsx";
import {APP_ALL, GET_APPS_BY_OBJECT_IDS} from "@/components/graphql/app.graphql.ts";

const columns: ColumnDef<AppAllFragment>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
];

export function AppsPage() {
    const {
        loading: appsLoading,
        error: appsError,
        data: appsData,
    } = useQuery(GET_APPS_BY_OBJECT_IDS);

    const apps = (appsData?.android_firmware_connection?.edges ?? [])
        .flatMap(firmwareEdge => (firmwareEdge?.node?.androidAppIdList?.edges ?? []))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(edge => useFragment(APP_ALL, edge?.node))
        .filter(isNonNullish)

    return (
        <BasePage title="Firmwares">
            <StateHandlingScrollableDataTable
                columns={columns}
                data={apps}
                dataLoading={appsLoading}
                dataError={appsError}
            />
        </BasePage>
    );
}
