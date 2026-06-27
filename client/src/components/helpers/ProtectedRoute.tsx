import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./ContextApi";

interface ProtectedRouteProps {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { userId } = useContext(UserContext);
    
    if (!userId) {
        return <Navigate to="/" replace />
    }

    return children;
};