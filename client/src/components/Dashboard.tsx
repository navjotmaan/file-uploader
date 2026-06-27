import { useEffect, useState, useContext } from "react";
import { FolderForm } from "./forms/FolderForm";
import api from "./api";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./helpers/ContextApi";

export interface Folder {
    id: string;
    name: string;
    _count: {
        files: number;
    };
}

export const Dashboard = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [toggleForm, setToggleForm] = useState(false);

    const { userId, userName } = useContext(UserContext);

    if (!userId) {
        return <Navigate to="/" replace />
    }

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
            console.log("logout successfully");
            return <Navigate to="/" replace />
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="p-5">
            <span className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                    <h1 className="text-4xl font-bold">Hello, {userName}!</h1>
                </span>
                <button onClick={handleLogout} className="border mt-5 cursor-pointer rounded-lg font-semibold px-3 py-1">Log Out</button>
            </span>

            <button onClick={() => setToggleForm(!toggleForm)} className="bg-[#09a0d3] text-white mt-5 cursor-pointer rounded-lg font-bold px-3 py-1">+ New</button>

            {toggleForm ? <FolderForm setFolders={setFolders} setToggleForm={setToggleForm} /> : ''}

            <main className="flex gap-10 flex-wrap p-10">
                {folders.map((f: Folder) => (
                    <div key={f.id} className="relative border p-2 mt-10 w-[200px] min-h-[100px] text-center rounded-lg">

                        <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-icon lucide-folder text-[#09a0d3]"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                        </div>

                        <Link to={`/folder/${f.id}`} className="font-semibold text-lg" >
                            {f.name}
                        </Link>
                        <p className="text-gray-500">{f._count?.files ? `${f._count.files} ` : '0 '}files</p>
                    </div>
                ))}
            </main>
        </div>
    )
};