import {Route, Routes} from "react-router";
import EmulatorPage from "./pages/EmulatorPage";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {ModeToggle} from "@/components/mode-toggle.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>
                <Route path="/emulator" element={<EmulatorPage/>}/>
            </Routes>
            <ModeToggle />
        </ThemeProvider>
    )
}

export default App
