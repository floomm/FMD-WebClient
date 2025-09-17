import {useCallback, useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Card} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {useAuth} from "@/lib/auth.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {
    CircleCheckBigIcon,
    CircleOffIcon,
    LoaderCircleIcon, ShieldEllipsisIcon,
    XIcon
} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useMutation, useQuery} from "@apollo/client";
import {CREATE_FIRMWARE_EXTRACTOR_JOB, GET_RQ_JOB} from "@/components/graphql/firmware.graphql.ts";

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
    jobId?: string;
}

const makeUploadId = (file: File) => `${file.name}:${file.size.toString()}:${file.lastModified.toString()}`;

function JobStatus({jobId}: Readonly<{ jobId: string }>) {
    const {data} = useQuery(GET_RQ_JOB, {
        variables: {jobId},
        pollInterval: 5000,
        fetchPolicy: "cache-and-network",
    });

    const status = data?.rq_job?.status;
    if (!status) return <ShieldEllipsisIcon/>;

    if (data.rq_job?.isFinished) {
        return (
            <CircleCheckBigIcon color="green"/>
        );
    }

    if (data.rq_job?.isFailed) {
        return (
            <CircleOffIcon color="red"/>
        );
    }

    return (
        <>
            <LoaderCircleIcon className="animate-spin mr-2"/>
            <span>{status}</span>
        </>
    );
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
    const [createFirmwareExtractorJob] = useMutation(CREATE_FIRMWARE_EXTRACTOR_JOB);

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

    useEffect(() => {
        if (
            fileUploads.length > 0 &&
            fileUploads.every(upload => upload.serverResponded) &&
            fileUploads.every(upload => !upload.jobId)
        ) {
            createFirmwareExtractorJob({variables: {storageIndex}})
                .then(res => {
                    const jobId = res.data?.createFirmwareExtractorJob?.jobId;
                    if (jobId) {
                        setFileUploads(prev =>
                            prev.map(upload => ({...upload, jobId}))
                        );
                    }
                })
                .catch(console.error);
        }
    }, [createFirmwareExtractorJob, fileUploads, storageIndex]);

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
            {fileUploads.length > 0 && (
                <Table className="w-full mt-2">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Filename</TableHead>
                            <TableHead className="text-center">1. Upload to Server</TableHead>
                            <TableHead className="text-center">2. Server Validation</TableHead>
                            <TableHead className="text-center">3. Firmware Extraction</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fileUploads.map((upload) => {
                            if (!upload.error) {
                                return (
                                    <TableRow key={upload.id}>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                <span>{upload.file.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2 w-full">
                                                {upload.percentComplete < 100 && (
                                                    <>
                                                        <LoaderCircleIcon className="animate-spin"/>
                                                        <Progress value={upload.percentComplete}/>
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
                                                    </>
                                                )}
                                                {upload.percentComplete >= 100 && <CircleCheckBigIcon color="green"/>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                {upload.percentComplete < 100 && (
                                                    <ShieldEllipsisIcon/>
                                                )}
                                                {upload.percentComplete >= 100 && !upload.serverResponded && (
                                                    <LoaderCircleIcon className="animate-spin"/>
                                                )}
                                                {upload.percentComplete >= 100 && upload.serverResponded && (
                                                    <CircleCheckBigIcon color="green"/>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                {upload.jobId && (
                                                    <JobStatus jobId={upload.jobId}/>
                                                )}
                                                {!upload.jobId && !upload.serverResponded && (
                                                    <ShieldEllipsisIcon/>
                                                )}
                                                {!upload.jobId && upload.serverResponded && (
                                                    <LoaderCircleIcon className="animate-spin"/>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            }

                            return (
                                <TableRow key={upload.id}>
                                    <TableCell>
                                        <Alert variant="destructive">
                                            <CircleOffIcon/>
                                            <AlertTitle>Error while uploading {upload.file.name}</AlertTitle>
                                            <AlertDescription>{upload.error}</AlertDescription>
                                        </Alert>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}