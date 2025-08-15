import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {Route, Routes} from "react-router";
import HomePage from "@/pages/home-page.tsx";
import EmulatorPage from "@/pages/EmulatorPage";

function App() {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader/>
                <div className="flex flex-1">
                    <AppSidebar/>
                    <SidebarInset>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/emulator" element={<EmulatorPage/>}/>
                        </Routes>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}

export default App
