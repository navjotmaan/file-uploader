import { useEffect, useState } from "react"
import { FileForm } from "./forms/FileForm";
import { useParams } from "react-router-dom";
import api from "./api";

export interface File {
    id: string;
    name: string;
    url: string;
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

    function formatDate(dateString?: string) {
        if (!dateString) return "—";

        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "—";

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const handleDownload = (publicUrl: string, fileName: string) => {
        // Append the download trigger query parameter to the public URL
        const triggerDownloadUrl = `${publicUrl}?download=${encodeURIComponent(fileName)}`;
        
        // Open the URL in a new tab; the browser will catch the header and download it instantly
        window.open(triggerDownloadUrl, '_blank');
    };

    return (
        <div className="md:px-10 py-10 px-5">
            <FileForm folderId={id} setFiles={setFiles} />

            {files.length === 0 ? (
                <p className="text-center text-gray-500">No files found in this folder.</p>
            ) : (
            files.map((f: File) => (
                <div key={f.id} className="mx-auto bg-[#e9ecef] rounded py-2 px-5 my-5 md:flex justify-between items-center md:w-[60%]">
                    <a href={f.url} target="_blank" rel="noopener noreferrer">
                        {f.name}
                    </a>
                    <span className="flex justify-between items-center md:min-w-[35%]">
                        <p>{formatDate(f.updatedAt)}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download-icon lucide-download cursor-pointer" onClick={() => handleDownload(f.url, f.name)}><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
                    </span>
                    <p>{f.size ? `${(f.size / 1024).toFixed(0)} KB` : "—"}</p>
                </div>
            ))
            )}
        </div>
    )
}