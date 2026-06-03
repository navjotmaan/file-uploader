import { useState, useContext } from "react"
import api from "../api";
import { UserContext } from "../helpers/ContextApi";
import type { Folder } from "../Dashboard";

export const FolderForm = ({ setFolders }: { setFolders: React.Dispatch<React.SetStateAction<Folder[]>> }) => {
    const [folderName, setFolderName] = useState('');
    const userId = useContext(UserContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await api.post('/folder/new', {folderName, userId});
            const newFolder = response.data;
            setFolders((prevFolders: Folder[]) => [...prevFolders, newFolder]);
            setFolderName('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="my-20">
            <label htmlFor="folderName">Folder Name: </label>
            <input id="folderName" name="folderName" value={folderName} onChange={handleChange} required className="border"/>
            <button type="submit" className="border">Create</button>
        </form>
    )
}