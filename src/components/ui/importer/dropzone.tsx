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
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        console.log("Uploading file:", file.name);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "firmware");
        formData.append("storage_index", "0");

        try {
            const response = await fetch("/upload/file", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("Upload failed:", result);
            } else {
                console.log("Upload complete:", result);
            }
        } catch (error) {
            console.error("Upload error:", error);
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
        multiple: false,
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