import { useState, useContext } from "react"
import api from "../api";
import { UserContext } from "../helpers/ContextApi";

export const FolderForm = () => {
    const [folderName, setFolderName] = useState('');
    const userId = useContext(UserContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await api.post('/new/folder', {folderName, userId});
            console.log(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="folderName">Folder Name: </label>
            <input id="folderName" name="folderName" value={folderName} onChange={handleChange} required className="border"/>
            <button type="submit" className="border">Create</button>
        </form>
    )
}