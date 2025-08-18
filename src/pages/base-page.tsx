import {ReactNode} from "react";
import {TypographyH1} from "@/components/typography/headings.tsx";

type props = {
    children: ReactNode,
    title: string,
}

export function BasePage({children, title}: Readonly<props>) {
    return (
        <>
            <div className="m-4">
                <TypographyH1>{title}</TypographyH1>
            </div>

            {children}
        </>
    );
}