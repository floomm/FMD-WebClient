import {Route, Routes} from "react-router";
import EmulatorPage from "./pages/EmulatorPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/emulator" element={<EmulatorPage/>}/>
            </Routes>
        </>
    )
}

export default App
