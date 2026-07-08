import { useEffect, useState } from "react"
import api from "../api";
import type { Folder } from "../Dashboard";

export const FolderForm = ({ setFolders, setToggleForm, name, id }: { setFolders: React.Dispatch<React.SetStateAction<Folder[]>>; setToggleForm: React.Dispatch<React.SetStateAction<boolean>>; name?: string; id?: string }) => {
    const [folderName, setFolderName] = useState(name ?? "");

    useEffect(() => {
        setFolderName(name ?? "");
    }, [name, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (id) {
                const response = await api.put(`/folder/${id}`, { folderName });
                setFolders((prevFolders: Folder[]) => prevFolders.map((folder) => folder.id === id ? response.data : folder));
                setFolderName('');
                setToggleForm(false);
                return;
            }

            const response = await api.post('/folder/new', { folderName });
            const newFolder = response.data;
            setFolders((prevFolders: Folder[]) => [...prevFolders, newFolder]);
            setFolderName('');
            setToggleForm(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#f8f9fa] flex flex-col gap-2 w-70 rounded-lg p-5 absolute shadow-md top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <label htmlFor="folderName">Folder Name</label>
            <input id="folderName" name="folderName" value={folderName} onChange={handleChange} required className="border rounded px-2"/>
            <button type="submit" className="bg-[#09a0d3] text-white w-20 mt-5 rounded-lg cursor-pointer font-semibold p-1 hover:bg-[#0781ab] transform active:scale-95 transition-transform duration-100">
                {id ? "Edit" : "Create"}
            </button>
        </form>
    )
};