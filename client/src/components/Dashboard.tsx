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

    const { userId, userName, logout } = useContext(UserContext);

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

    return (
        <div className="md:p-10 bg-[#e9ecef] min-h-screen">
            <span className="flex justify-between items-start">
                <span>
                    <h1 className="md:text-4xl text-2xl font-bold">"Hello, {userName}!"</h1>
                    <p className="text-gray-600 text-lg p-2">It's your cloud space to manage your files!</p>
                </span>
                <button onClick={logout} className="cursor-pointer rounded-lg font-semibold px-3 py-1 bg-white shadow-md transform active:scale-95 transition-transform duration-100">Log out</button>
            </span>
            <hr></hr>

            <button onClick={() => setToggleForm(!toggleForm)} className="bg-[#09a0d3] text-white mt-8 cursor-pointer rounded-lg font-bold px-3 py-1 hover:bg-[#0781ab] transform active:scale-95 transition-transform duration-100">+ New Folder</button>

            {toggleForm && (
                <>
                    <div 
                        className="fixed inset-0 z-40 bg-black/10" 
                        onClick={() => setToggleForm(false)} 
                    />
                    
                    <div className="relative z-50">
                        <FolderForm setFolders={setFolders} setToggleForm={setToggleForm} />
                    </div>
                </>
            )}

            <main className="flex md:gap-10 flex-wrap py-5">
                {folders.length === 0 ? (
                    <div className="text-gray-500">
                        <p>No folders found.</p>
                        <p>Click 'New Folder' button to create a folder.</p>
                        <p>Click on a folder to view its contents and to add files.</p>
                    </div>
                ) : (folders.map((f: Folder) => (
                    <div key={f.id} className="flex items-center justify-center gap-5 relative p-2 mt-8 w-[220px] min-h-[100px] bg-white text-center rounded-lg shadow-md">
                        
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-icon lucide-folder text-[#09a0d3]"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                    

                        <div>
                            <Link to={`/folder/${f.id}`} className="font-semibold text-lg hover:underline" >
                                {f.name}
                            </Link>
                            <p className="text-gray-500">{f._count?.files ? `${f._count.files} ` : '0 '}files</p>
                        </div>
                    </div>
                )))}
            </main>
        </div>
    )
};