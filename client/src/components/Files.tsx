import { useEffect, useState } from "react"
import { FileForm } from "./forms/FileForm";
import { useParams } from "react-router-dom";
import api from "./api";

export interface File {
    id: string;
    name: string;
    url?: string;
    size?: number;
    updatedAt: string;
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

    function formatDate(dateString: string) {
        const date = new Date(dateString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
        return formattedDate;
    }

    return (
        <div className="p-10">
            <FileForm folderId={id} setFiles={setFiles} />

            {files.length === 0 ? (
                <p className="text-center text-gray-500">No files found in this folder.</p>
            ) : (
            files.map((f: File) => (
                <div key={f.id} className="mx-auto bg-[#e9ecef] rounded py-2 px-5 my-5 flex justify-between items-center w-[60%]">
                    <a href={f.url} key={f.id} target="_blank"
                    rel="noopener noreferrer">
                    {f.name}
                    </a>
                    <p>{formatDate(f.updatedAt)}</p>
                    <p>{f.size && `${(f.size / 1024).toFixed(0)} KB`}</p>
                </div>
            ))
            )}
        </div>
    )
}