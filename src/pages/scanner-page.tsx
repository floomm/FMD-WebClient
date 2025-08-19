import {BasePage} from "@/pages/base-page.tsx";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {TypographyH4} from "@/components/ui/typography/headings.tsx";
import {CheckboxFormMultiple} from "@/components/ui/checkbox-form.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {Firmware, FirmwareDataTable} from "@/components/ui/firmware/firmware-data-table.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export function ScannerPage() {
    return (
        <BasePage title="App Scanner">
            <div className="flex flex-col items-center my-8 mx-4 gap-8">
                <ResizablePanelGroup direction="horizontal" className="border-t border-b">
                    <ResizablePanel defaultSize={40}>
                        <FirmwaresPanel/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel defaultSize={40}>
                        <AppsPanel/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel defaultSize={20}>
                        <ScannersPanel/>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </BasePage>
    );
}

function FirmwaresPanel() {
    const columns: ColumnDef<Firmware>[] = [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => { table.toggleAllPageRowsSelected(!!value); }}
                    aria-label="Select all"
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => { row.toggleSelected(!!value); }}
                    aria-label="Select row"
                />
            ),
        },
        {
            accessorKey: "originalFilename",
            header: "Original Filename",
        },
    ];

    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <TypographyH4>Firmwares</TypographyH4>
            <FirmwareDataTable columns={columns}/>
        </div>
    );
}

function AppsPanel() {
    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <TypographyH4>Apps</TypographyH4>
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
        <div className="flex flex-col h-full p-6 gap-6">
            <TypographyH4>Scanners</TypographyH4>
            <CheckboxFormMultiple
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