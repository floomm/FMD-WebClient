import {Fragment, useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Card} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {useAuth} from "@/lib/auth.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {CircleCheckBigIcon, LoaderCircleIcon, XIcon} from "lucide-react";

type FileUpload = {
    file: File;
    percentComplete: number;
    serverResponded: boolean;
    xhr?: XMLHttpRequest;
}

export function Dropzone(
    {
        className = "",
        message = "Drag 'n' drop files here, or click to select files",
    }
) {
    const {getToken} = useAuth();
    const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const token = getToken();
        if (!token) {
            console.error("No auth token available.");
            return;
        }

        setFileUploads(acceptedFiles.map(file => ({file, percentComplete: 0, serverResponded: false})));

        acceptedFiles.forEach((file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "firmware");
            formData.append("storage_index", "0");

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/upload/file");
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setFileUploads(prev =>
                        prev.map(upload => upload.file == file ? {...upload, percentComplete} : upload)
                    );
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log("Upload complete:", xhr.responseText);
                } else {
                    console.error("Upload failed:", xhr.responseText);
                }
                setFileUploads(prev =>
                    prev.map(upload => upload.file == file ? {...upload, serverResponded: true} : upload)
                );
            };

            xhr.onerror = () => {
                console.error("Upload error:", xhr.statusText);
                setFileUploads(prev =>
                    prev.map(upload => upload.file == file ? {...upload, serverResponded: true} : upload)
                );
            };

            xhr.onabort = () => {
                setFileUploads(prev => prev.filter(upload => upload.file !== file));
            };

            setFileUploads(prev =>
                prev.map(upload => upload.file == file ? {...upload, xhr} : upload)
            );

            xhr.send(formData);
        });
    }, [getToken]);

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
                <Card className="flex justify-center text-center min-h-48 p-4 border-2 border-dashed">
                    <input {...getInputProps()} />
                    <p>{message}</p>
                </Card>
            </div>
            <div className="m-2 w-full">
                {fileUploads.map((value, index) => (
                    <Fragment key={index}>
                        <div className="flex items-center gap-4 w-full mt-2">
                            {!value.serverResponded && <LoaderCircleIcon className="animate-spin"/>}
                            {value.serverResponded && <CircleCheckBigIcon color="green"/>}
                            <div className="w-full">
                                <span>{value.file.name}</span>
                                <Progress value={value.percentComplete}/>
                            </div>
                            {value.percentComplete < 100 && <XIcon
                                onClick={() => {
                                    const current = fileUploads[index];
                                    if (current.xhr) {
                                        current.xhr.abort();
                                    } else {
                                        setFileUploads(prev => prev.filter((_, i) => i !== index));
                                    }
                                }}
                                className="cursor-pointer"
                            />}
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    );
}