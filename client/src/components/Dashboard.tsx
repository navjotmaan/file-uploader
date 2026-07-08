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
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | "">("");
    const [id, setId] = useState<string | "">("");
    const [loading, setLoading] = useState(false);

    const toggleDropdown = (folderId: string) => {
        setActiveFolderId(prevId => prevId === folderId ? null : folderId);
    };

    const { userId, userName, logout } = useContext(UserContext);

    if (!userId) {
        return <Navigate to="/" replace />
    }

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await api.get('/folder/all');
                setFolders(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDeleteFolder = async (folderId: string) => {
        try {
            setLoading(true);
            await api.delete('/folder/delete', { data: { folderId } });
            setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== folderId));
            setActiveFolderId(null);
        } catch (err) {
            console.log(err);
        } finally { 
            setLoading(false);
        }
    };

    const handleOpenNewFolderForm = () => {
        setSelectedName("");
        setId("");
        setToggleForm(true);
    };

    const handleEdit = (name: string, id: string) => {
        setSelectedName(name);
        setId(id);
        setToggleForm(true);
    };

    const handleLogout = async () => {
        if (!logout) return;
        
        try {
            setLoading(true);
            await logout();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }   
    }

    return (
        <div className="md:p-10 p-5 bg-[#e9ecef] min-h-screen">
            <span className="flex justify-between items-start">
                <span>
                    <h1 className="md:text-4xl text-2xl font-bold">"Hello, {userName}!"</h1>
                    <p className="text-gray-600 md:text-lg p-2">It's your cloud space to manage your files!</p>
                </span>
                <button onClick={handleLogout} className="cursor-pointer rounded-lg font-semibold px-3 py-1 bg-white shadow-md hover:bg-gray-100 transform active:scale-95 transition-transform duration-100 md:text-lg text-sm">
                    {loading ? 
                        <div className="flex flex-col gap-5 items-center justify-center">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-black border-t-transparent"></div>
                        </div> 
                        : "Log out"
                    }
                </button>
            </span>
            <hr></hr>

            <button onClick={handleOpenNewFolderForm} className="bg-[#09a0d3] text-white mt-8 cursor-pointer rounded-lg font-bold px-3 py-1 hover:bg-[#0781ab] transform active:scale-95 transition-transform duration-100">+ New Folder</button>

            {toggleForm && (
                <>
                    <div 
                        className="fixed inset-0 z-40 bg-black/20" 
                        onClick={() => {
                            setToggleForm(false);
                            setSelectedName("");
                            setId("");
                        }} 
                    />
                    
                    <div className="relative z-50">
                        <FolderForm setFolders={setFolders} setToggleForm={setToggleForm} name={selectedName} id={id} />
                    </div>
                </>
            )}


            <main className="flex md:gap-10 flex-wrap py-5">
                {loading ? (
                    <div className="flex flex-col gap-5 items-center justify-center m-auto mt-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-3 border-solid border-[#09a0d3] border-t-transparent"></div>
                    </div> 
                ) : folders.length === 0 ? (
                    <div className="text-gray-500 mt-8 flex flex-col gap-2">
                        <p>No folder found.</p>
                        <p>Click <b>'New Folder'</b> button to create a folder.</p>
                        <p>Click on a folder to view its contents and to add files.</p>
                    </div>
                ) : (folders.map((f: Folder) => (
                    <div key={f.id} className="flex items-center justify-center relative gap-5 p-2 mt-8 w-[250px] min-h-[120px] bg-white text-center rounded-lg shadow-md">

                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-icon lucide-folder text-[#09a0d3]"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>

                        <span>
                            <Link to={`/folder/${f.id}`} className="font-semibold text-lg hover:underline" >
                                {f.name}
                            </Link>
                            <p className="text-gray-500">{f._count?.files ? `${f._count.files} ` : '0 '}files</p>
                        </span>

                        <svg onClick={() => toggleDropdown(f.id)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-2 cursor-pointer lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>

                        {activeFolderId === f.id && (
                            <div onClick={() => setActiveFolderId(null)} className='absolute top-3 right-6 rounded-lg px-2 flex flex-col items-center justify-center w-20 bg-white border border-[#4B2E2B] text-[#4B2E2B] shadow-md'>
                                <button onClick={() => handleEdit(f.name, f.id)} className='rounded-lg py-1 px-3 cursor-pointer'>Edit</button>
                                <button onClick={() => handleDeleteFolder(f.id)} className="rounded-xl p-1 px-2 cursor-pointer">Delete</button>
                            </div>
                        )}

                    </div>
                )))}
            </main>
        </div>
    )
};