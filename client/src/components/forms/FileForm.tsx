import { useState } from "react"
import api from "../api";
import type { File as FileModel } from '../Files';

export const FileForm = ({ folderId, setFiles }: { folderId: string, setFiles: React.Dispatch<React.SetStateAction<FileModel[]>>}) => {
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!file) {
            console.log('No file selected');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folderId', folderId);
            const response = await api.post(`/file/${folderId}/new`, formData);
            setFiles((prevFiles: FileModel[]) => [...prevFiles, response.data]);
            setFile(null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="my-20 flex flex-col gap-2 w-50 items-center">
            <input id="file" name="fileName" type="file" onChange={handleChange} required className="border rounded"/>
            <button type="submit" className="w-20 border rounded">Add</button>
        </form>
    )
}