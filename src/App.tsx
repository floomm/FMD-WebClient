import {Route, Routes} from "react-router";
import EmulatorPage from "./pages/EmulatorPage";
import Navbar from "@/components/navbar.tsx";
import AboutPage from "@/pages/about-page.tsx";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/emulator" element={<EmulatorPage/>}/>
            </Routes>
        </>
    );
}

export default App
