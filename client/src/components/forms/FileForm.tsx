import { useRef, useState } from "react"
import api from "../api";
import type { File as FileModel } from '../Files';

export const FileForm = ({ folderId, setFiles }: { folderId: string, setFiles: React.Dispatch<React.SetStateAction<FileModel[]>>}) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!file) {
            console.log('No file selected');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folderId', folderId);
            const response = await api.post(`/file/${folderId}/new`, formData);
            setFiles((prevFiles: FileModel[]) => [...prevFiles, response.data]);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="mb-10 flex gap-3 items-center justify-center">
            <input ref={fileInputRef} id="file" name="fileName" type="file" onChange={handleChange} required className="border w-full md:w-auto rounded px-2 py-1 bg-[#f8f9fa]"/>
            <button type="submit" className="w-20 bg-[#09a0d3] text-white cursor-pointer rounded-lg font-bold px-3 py-1 hover:bg-[#0781ab] transform active:scale-95 transition-transform duration-100">
                {loading ? 
                    <div className="flex flex-col gap-5 items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                    </div> 
                    : "Add"
                }
            </button>
        </form>
    )
}