import { useState } from "react"
import api from "../api";
import type { Folder } from "../Dashboard";

export const FolderForm = ({ setFolders }: { setFolders: React.Dispatch<React.SetStateAction<Folder[]>> }) => {
    const [folderName, setFolderName] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await api.post('/folder/new', {folderName});
            const newFolder = response.data;
            setFolders((prevFolders: Folder[]) => [...prevFolders, newFolder]);
            setFolderName('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="my-20 flex flex-col gap-2 w-50 items-center">
            <label htmlFor="folderName">Folder Name</label>
            <input id="folderName" name="folderName" value={folderName} onChange={handleChange} required className="border rounded"/>
            <button type="submit" className="w-20 border rounded">Create</button>
        </form>
    )
}