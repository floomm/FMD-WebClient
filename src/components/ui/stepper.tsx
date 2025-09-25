import {ComponentProps, Fragment, JSX, useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {Card} from "@/components/ui/card.tsx";

function Stepper(
    {
        stepComponents,
        numberOfSteps,
        stepLabels,
        initialStep = 0,
        className,
        ...props
    }: ComponentProps<"div"> & {
        numberOfSteps: number;
        stepComponents: Array<JSX.Element>
        stepLabels?: Array<string | undefined>;
        initialStep?: number;
    }) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const activeColor = (index: number) => currentStep >= index ? 'bg-primary' : 'bg-gray-400';
    const isFinalStep = (index: number) => index === numberOfSteps - 1;
    const goToNextStep = () => {
        setCurrentStep(prev => prev === numberOfSteps - 1 ? prev : prev + 1);
    };
    const goToPreviousStep = () => {
        setCurrentStep(prev => prev <= 0 ? prev : prev - 1);
    };

    return (
        <div
            className={cn(className)}
            {...props}
        >
            <div className="flex items-center">
                {Array.from({length: numberOfSteps}).map((_, index) => (
                    <Fragment key={index}>
                        {stepLabels && stepLabels[index] && (
                            <Badge className={`h-8 text-sm ${activeColor(index)}`}>{stepLabels[index]}</Badge>
                        )}
                        {stepLabels && !stepLabels[index] && (
                            <Badge className={`h-8 min-w-8 rounded-full ${activeColor(index)}`}/>
                        )}
                        {isFinalStep(index) ? null : <div className={`w-12 h-1 ${activeColor(index)}`}></div>}
                    </Fragment>
                ))}
            </div>
            <br/>
            <Card>
                {stepComponents[currentStep]}
            </Card>
            <br/>
            <section className="flex gap-10">
                <Button
                    disabled={currentStep <= 0}
                    onClick={goToPreviousStep}
                >
                    <ChevronLeftIcon/>
                    Previous step
                </Button>
                <Button
                    disabled={currentStep >= numberOfSteps - 1}
                    onClick={goToNextStep}
                >
                    Next step
                    <ChevronRightIcon/>
                </Button>
            </section>
        </div>
    );
}

export {Stepper}
