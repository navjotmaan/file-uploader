import { createContext, useState, useEffect, type ReactNode } from "react";
import api from "../api";

type UserContextType = { userId: string | null; userName: string | null; };

export const UserContext = createContext<UserContextType>({
  userId: null,
  userName: null,
});

export function UserProvider({ children }: { children: ReactNode}) {
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get('/api/me')
                setUserId(response.data.user.id);
                setUserName(response.data.user.name);
            } catch {
                setUserId(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <UserContext.Provider value={{ userId, userName }}>
            {children}
        </UserContext.Provider>
    )
}