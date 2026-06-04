import { useEffect, useState } from "react";
import { FolderForm } from "./forms/FolderForm";
import api from "./api";
import { Link, useNavigate } from "react-router-dom";
import cloud from '../../public/cloud.png';

export interface Folder {
    id: string;
    name: string;
}

export const Dashboard = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [toggleForm, setToggleForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get('/folder/all');
                setFolders(response.data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    function handleLogout() {
        try {
            api.post('/logout');
            navigate('/');
            console.log("logout successfully");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="p-5">
            <span className="flex justify-between">
                <span className="flex items-center gap-2">
                    <img src={cloud} width={50} height={50} alt="cloud" />
                    <h1 className="text-4xl font-bold">Vault</h1>
                </span>
                <button onClick={handleLogout} className="border rounded px-3">Log Out</button>
            </span>

            <button onClick={() => setToggleForm(!toggleForm)} className="p-2 font-semibold cursor-pointer bg-orange-500 rounded-lg mt-5">+ New</button>

            {toggleForm ? <FolderForm setFolders={setFolders} /> : ''}

            <main className="flex gap-10 flex-wrap p-10">
                {folders.map((f: Folder) => (
                    <div key={f.id} className="border p-2 mt-10 w-[200px] min-h-[100px] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide text-yellow-500 lucide-folder-icon lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                    <Link to={`/folder/${f.id}`} className="font-semibold" >
                        {f.name}
                    </Link>
                    </div>
                ))}
            </main>
        </div>
    )
};