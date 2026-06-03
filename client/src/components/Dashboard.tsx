import { useEffect, useState } from "react";
import { FolderForm } from "./forms/Folder";
import api from "./api";
import { Link } from "react-router-dom";

export interface Folder {
    id: string;
    name: string;
}

export const Dashboard = () => {
    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get('/folder/all');
                setFolders(response.data);
                console.log(response.data)
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    return (
        <div>
            <h1>File Uploader</h1>

            <FolderForm setFolders={setFolders} />

            {folders.map((f: Folder) => (
                <Link key={f.id} to={`/folder/${f.id}`} className="border p-2 mt-10">
                    {f.name}
                </Link>
            ))}
        </div>
    )
};