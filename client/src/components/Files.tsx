import { useEffect, useState } from "react"
import { FileForm } from "./forms/FileForm";
import { useParams } from "react-router-dom";
import api from "./api";

export interface File {
    id: string;
    name: string;
    url?: string;
    size?: number;
}

export const Files = () => {
    const [files, setFiles] = useState<File[]>([]);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await api.get(`/file/${id}/all`);
                setFiles(res.data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [id]);

    if (!id) {
        return <div>Invalid Folder</div>;
    }

    return (
        <div className="p-20">
            <FileForm folderId={id} setFiles={setFiles} />
            {files.map((f: File) => (
                <a href={f.url} key={f.id} className="border rounded p-2 w-50" target="_blank"
                 rel="noopener noreferrer">
                    {f.name}
                </a>
            ))}
        </div>
    )
}