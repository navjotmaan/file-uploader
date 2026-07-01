import { createContext, useState, useEffect, type ReactNode } from "react";
import api from "../api";

type UserContextType = { userId: string | null; userName: string | null; setUserId?: (id: string | null) => void | null; setUserName?: (name: string | null) => void | null; signup: (name: string, email: string, password: string) => Promise<void>; login: (email: string, password: string) => Promise<void>; logout?: () => Promise<void>; };

export const UserContext = createContext<UserContextType>({
  userId: null,
  userName: null,
  setUserId: () => {},
  setUserName: () => {},
  signup: async () => {},
  login: async () => {},
  logout: async () => {}
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
                setUserName(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId, userName]);

    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await api.post('/register', { name, email, password });    
            setUserId(response.data.user.id);
            setUserName(response.data.user.name);
            return response.data;
        } catch (err) {
            console.log('Registration failed', err);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', { email, password });
            setUserId(response.data.user.id);
            setUserName(response.data.user.name);
            return response.data;
        } catch (err) {
            console.log('Login failed', err);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            setUserId(null);
            setUserName(null);
        } catch (err) {
            console.log('Logout failed', err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <UserContext.Provider value={{ userId, userName, setUserId, setUserName, signup, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}