import {Navigate, Route, Routes} from "react-router";
import LoginPage from "@/pages/login-page.tsx";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute.tsx";
import ProtectedLayout from "@/routes/ProtectedLayout.tsx";
import HomePage from "@/pages/home-page.tsx";
import EmulatorPage from "@/pages/EmulatorPage";
import {ImporterPage} from "@/pages/importer-page.tsx";

function App() {
    return (
        <Routes>
            <Route element={<PublicOnlyRoute/>}>
                <Route path="/login" element={<LoginPage/>}/>
            </Route>

            <Route element={<ProtectedLayout/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/importer" element={<ImporterPage/>}/>
                <Route path="/emulator" element={<EmulatorPage/>}/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
                {/*<Route path="*" element={<NotFoundPage/>}/>*/} {/*TOOD: Add 404 page?*/}
            </Route>
        </Routes>
    );
}

export default App
