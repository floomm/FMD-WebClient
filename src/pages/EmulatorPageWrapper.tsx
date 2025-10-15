import ReactDOM from "react-dom/client";
import {useEffect, useRef} from "react";
import {StyleSheetManager, ThemeProvider} from "styled-components";
import {GlobalStyles} from "@/assets/emulator/theming/global";
import EmulatorPage from "@/pages/EmulatorPage";
import {useTheme} from "@/components/ui/theming/theme-provider.tsx";
import {darkTheme, lightTheme} from "@/assets/emulator/theming/theme";

export function EmulatorPageWrapper() {
    const containerRef = useRef<HTMLDivElement>(null);
    const shadowRootRef = useRef<ShadowRoot | null>(null);
    // Use theme but resolve "system" to "light" or "dark"
    const {theme} = useTheme();
    let emulatorTheme;
    if (theme === 'light' || theme === 'dark') {
        emulatorTheme = theme;
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        emulatorTheme = prefersDark ? 'dark' : 'light';
    }

    const themeMode = emulatorTheme === 'light' ? lightTheme : darkTheme;

    useEffect(() => {
        if (!shadowRootRef.current && containerRef.current) {
            shadowRootRef.current = containerRef.current.attachShadow({mode: "open"});

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
            shadowRootRef.current.appendChild(link);

            const mountPoint = document.createElement("div");
            shadowRootRef.current.appendChild(mountPoint);

            const root = ReactDOM.createRoot(mountPoint);
            root.render(
                <StyleSheetManager target={shadowRootRef.current}>
                    <ThemeProvider theme={themeMode}>
                        <GlobalStyles/>
                        <EmulatorPage/>
                    </ThemeProvider>
                </StyleSheetManager>
            );
        }
    }, [themeMode]);

    return <div ref={containerRef}/>;
}