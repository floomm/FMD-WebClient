import {useParams} from "react-router";
import {BasePage} from "@/pages/base-page.tsx";
import {useQuery} from "@apollo/client";
import {isNonNullish} from "@/lib/graphql/graphql-utils.ts";
import {APP_ALL, GET_APP_BY_ID} from "@/components/graphql/app.graphql.ts";
import {useFragment} from "@/__generated__";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircleIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {AppAllFragment} from "@/__generated__/graphql.ts";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";

export function AppPage() {
    const {appId} = useParams<{ appId: string }>();

    const {
        loading: appsLoading,
        data: appsData,
    } = useQuery(GET_APP_BY_ID, {
        variables: {id: appId as string},
        skip: !appId,
    });

    if (!appId) {
        return (
            <BasePage title={"App (missing ID)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Missing App ID.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }

    if (appsLoading) {
        return (
            <BasePage title="App">
                <Skeleton className="w-full h-[400px]"/>
            </BasePage>
        );
    }

    const apps = (appsData?.android_firmware_connection?.edges ?? [])
        .flatMap(firmwareEdge => (firmwareEdge?.node?.androidAppIdList?.edges ?? []))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(edge => useFragment(APP_ALL, edge?.node))
        .filter(isNonNullish)

    if (apps.length === 1) {
        const app: AppAllFragment = apps[0];

        return (
            <BasePage title="App">
                <Table>
                    <TableBody>
                        {Object.entries(app).map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell className="font-medium">{key}</TableCell>
                                <TableCell className="text-muted-foreground whitespace-pre-wrap">
                                    {(() => {
                                        let displayValue = String(value);

                                        try {
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
                                            const parsed = JSON.parse(value);
                                            displayValue = JSON.stringify(parsed, null, 2);
                                        } catch {
                                            // ignore, we leave it as string if parsing fails
                                        }

                                        return displayValue;
                                    })()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </BasePage>
        );
    }

    if (apps.length < 1) {
        return (
            <BasePage title={"App (no match)"}>
                <Alert variant="destructive">
                    <AlertCircleIcon/>
                    <AlertTitle>Could not find an app with ID '{appId}'.</AlertTitle>
                </Alert>
            </BasePage>
        );
    }
}