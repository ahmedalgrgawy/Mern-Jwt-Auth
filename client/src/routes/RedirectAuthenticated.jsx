import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export const RedirectAuthenticated = ({ children }) => {

    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated && user.isVerified) {
        return <Navigate to='/' replace />
    }

    return children;

}
