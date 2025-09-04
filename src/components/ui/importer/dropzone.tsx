import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {Card} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";

export function Dropzone(
    {
        className = "",
        message = "Drag 'n' drop files here, or click to select files",
    }
) {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        for (const file of acceptedFiles) {
            console.log(file.name);
        }
    }, []);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: {
            // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types
            'application/zip': ['.zip'],
            'application/x-zip-compressed': ['.zip'],
        },
        multiple: true,
        onDrop,
    });

    return (
        <div className={cn(className)}>
            <div {...getRootProps({className: "dropzone rounded-xl cursor-pointer"})}>
                <Card
                    className="flex justify-center text-center min-h-48 p-4 border-2 border-dashed"
                >
                    <input {...getInputProps()} />
                    <p>{message}</p>
                </Card>
            </div>
        </div>
    );
}