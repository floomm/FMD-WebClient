import {ReactNode} from "react";
import {TypographyH1} from "@/components/ui/typography/headings.tsx";

type Props = {
    children: ReactNode,
    title: string,
}

export function BasePage({children, title}: Readonly<Props>) {
    return (
        <>
            <div className="m-4">
                <TypographyH1>{title}</TypographyH1>
            </div>

            {children}
        </>
    );
}