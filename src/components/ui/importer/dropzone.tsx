import {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {APP_URL} from "@/envconfig.ts";

type Item = {
    name: string;
    progress: number; // 0..100
    status: "queued" | "uploading" | "done" | "error";
    error?: string;
};

export function Dropzone(
    {
        className = "",
        message = "Drag 'n' drop firmware here, or click to select files",
        storageIndex,
    }: Readonly<{
        className?: string;
        message?: string;
        storageIndex?: number;
    }>) {
    const [items, setItems] = useState<Item[]>([]);

    const setItem = (name: string, patch: Partial<Item>) => {
        setItems((prev) =>
            prev.map((i) => (i.name === name ? {...i, ...patch} : i))
        );
    };

    const uploadOne = (file: File) =>
        new Promise<void>((resolve) => {
            const name = file.name;
            const form = new FormData();
            form.append("firmware_file", file, name);
            if (typeof storageIndex === "number") {
                form.append("storage_index", String(storageIndex));
            }

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${APP_URL}/upload/firmware`);

            xhr.upload.onprogress = (e) => {
                if (!e.lengthComputable) return;
                const pct = Math.min(100, Math.floor((e.loaded / e.total) * 100));
                setItem(name, {progress: pct});
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 201) {
                    setItem(name, {status: "done", progress: 100, error: undefined});
                } else {
                    let err = "Upload failed.";
                    try {
                        const body = JSON.parse(xhr.responseText || "{}");
                        err = body.error || err;
                    } catch { /* empty */ }
                    setItem(name, {status: "error", error: err});
                }
                resolve();
            };

            setItem(name, {status: "uploading", progress: 0, error: undefined});
            xhr.send(form);
        });

    const onDrop = useCallback(async (accepted: File[]) => {
        // add to UI
        setItems((prev) => [
            ...prev,
            ...accepted.map((f) => ({
                name: f.name,
                progress: 0,
                status: "queued" as const,
            })),
        ]);
        // upload sequentially (safer for huge files)
        for (const f of accepted) {
            setItem(f.name, {status: "uploading", progress: 0});
            await uploadOne(f);
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive, fileRejections} = useDropzone({
        accept: {
            "application/zip": [".zip"],
            "application/x-zip-compressed": [".zip"],
        },
        multiple: true,
        onDrop,
    });

    return (
        <div className={cn(className)}>
            <div
                {...getRootProps({
                    className: cn(
                        "dropzone rounded-xl cursor-pointer",
                        isDragActive ? "ring-2 ring-primary/60" : ""
                    ),
                })}
            >
                <Card className="flex justify-center text-center min-h-48 p-4 border-2 border-dashed">
                    <input {...getInputProps()} />
                    <p className="text-sm text-muted-foreground">{message}</p>
                </Card>
            </div>

            {fileRejections.length > 0 && (
                <div className="mt-3 text-sm text-destructive">
                    {fileRejections.map((r, i) => (
                        <div key={i}>{r.file.name}: {r.errors.map(e => e.message).join(", ")}</div>
                    ))}
                </div>
            )}

            {items.length > 0 && (
                <div className="mt-4 space-y-2">
                    {items.map(({name, progress, status, error}) => (
                        <Card key={name} className="p-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="truncate font-medium">{name}</div>
                                <div className="text-xs capitalize text-muted-foreground">{status}</div>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-2 bg-primary transition-all" style={{width: `${progress.toString()}%`}}/>
                            </div>
                            {status === "error" && error && (
                                <div className="mt-1 text-xs text-destructive">{error}</div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}