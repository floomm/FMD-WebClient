import {ReactNode} from "react";

type props = {
    children: ReactNode,
}

function TypographyH1({children}: Readonly<props>) {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            {children}
        </h1>
    )
}

function TypographyH2({children}: Readonly<props>) {
    return (
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    )
}

function TypographyH3({children}: Readonly<props>) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
        </h3>
    )
}

function TypographyH4({children}: Readonly<props>) {
    return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {children}
        </h4>
    )
}

export {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
}
