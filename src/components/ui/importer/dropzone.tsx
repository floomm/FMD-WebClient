import {Fragment, useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Card} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {useAuth} from "@/lib/auth.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {CircleCheckBigIcon, CircleOffIcon, LoaderCircleIcon, XIcon} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

const makeUploadId = (file: File) => `${file.name}:${file.size.toString()}:${file.lastModified.toString()}`;

type DropzoneProps = {
    className?: string;
    message?: string;
    fileType: "firmware" | "apk";
    storageIndex?: number;
}

type FileUpload = {
    id: string;
    file: File;
    percentComplete: number;
    serverResponded: boolean;
    error?: string;
    xhr?: XMLHttpRequest;
}

export function Dropzone(
    {
        className = "",
        message = "Drag 'n' drop files here, or click to select files",
        fileType,
        storageIndex = 0,
    }: Readonly<DropzoneProps>
) {
    const {getToken} = useAuth();
    const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);

    const updateUpload = useCallback((id: string, patch: Partial<FileUpload>) => {
        setFileUploads(prev => prev.map(upload => (upload.id === id ? {...upload, ...patch} : upload)));
    }, []);

    const removeUpload = useCallback((id: string) => {
        setFileUploads(prev => prev.filter(upload => upload.id !== id));
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const token = getToken();
        if (!token) {
            console.error("No auth token available.");
            return;
        }

        setFileUploads(acceptedFiles.map(file => ({
            id: makeUploadId(file),
            file,
            percentComplete: 0,
            serverResponded: false,
        })));

        acceptedFiles.forEach((file) => {
            const id = makeUploadId(file);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", fileType);
            formData.append("storage_index", storageIndex.toString());

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/upload/file");
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    updateUpload(id, {percentComplete});
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    updateUpload(id, {serverResponded: true});
                    return;
                }

                updateUpload(id, {serverResponded: true, error: xhr.responseText})
            };

            xhr.onerror = () => {
                updateUpload(id, {serverResponded: true, error: xhr.statusText});
            };

            xhr.onabort = () => {
                removeUpload(id);
            };

            updateUpload(id, {xhr});

            xhr.send(formData);
        });
    }, [getToken, fileType, storageIndex, updateUpload, removeUpload]);

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
            <div className="w-full">
                {fileUploads.map((upload) => (
                    <Fragment key={upload.id}>
                        {!upload.error && (
                            <div className="flex items-center gap-4 w-full mt-2">
                                {!upload.serverResponded && <LoaderCircleIcon className="animate-spin"/>}
                                {upload.serverResponded && <CircleCheckBigIcon color="green"/>}
                                <div className="w-full">
                                    <span>{upload.file.name}</span>
                                    <Progress value={upload.percentComplete}/>
                                </div>
                                {upload.percentComplete < 100 && (
                                    <XIcon
                                        onClick={() => {
                                            if (upload.xhr) {
                                                upload.xhr.abort();
                                            } else {
                                                removeUpload(upload.id);
                                            }
                                        }}
                                        className="cursor-pointer"
                                    />
                                )}
                            </div>)}

                        {upload.error && (
                            <div className="flex items-center gap-4 w-full mt-2">
                                <Alert variant="destructive">
                                    <CircleOffIcon/>
                                    <AlertTitle>Error while uploading {upload.file.name}</AlertTitle>
                                    <AlertDescription>{upload.error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}