import * as React from "react"
import {
    BookOpen,
    Bug,
    Cpu,
    Import,
    ScanEye,
    Smartphone, Square,
} from "lucide-react"

import {NavAnalyses} from "@/components/nav-analyses.tsx"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {NavOptions} from "@/components/nav-options.tsx";
import {NavOperations} from "@/components/nav-operations.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

const data = {
    user: {
        name: "fmd-admin",
        email: "fmd-admin@fmd.localhost",
        avatar: "",
    },
    operations: [
        {
            title: "Importer",
            url: "/importer",
            icon: Import,
        },
        {
            title: "Scanner",
            url: "/scanner",
            icon: ScanEye,
        },
        {
            title: "Emulator",
            url: "/emulator",
            icon: Smartphone,
        },
    ],
    analyses: [
        {
            name: "Firmwares",
            url: "/firmwares",
            icon: Cpu,
        },
        {
            name: "Apps",
            url: "/apps",
            icon: Square,
        },
        {
            name: "Reports",
            url: "/reports",
            icon: BookOpen,
        },
    ],
    options: [
        {
            title: "Report Bug",
            url: "https://github.com/FirmwareDroid/FirmwareDroid/issues/new",
            icon: Bug,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            collapsible="icon"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Avatar>
                                        <AvatarImage src="../../public/Logo1.jpg" />
                                        <AvatarFallback>FMD</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="grid flex-1 text-left text-lg leading-tight">
                                    <span className="truncate font-medium">FirmwareDroid</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavOperations items={data.operations}/>
                <NavAnalyses analyses={data.analyses}/>
                <NavOptions items={data.options} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
