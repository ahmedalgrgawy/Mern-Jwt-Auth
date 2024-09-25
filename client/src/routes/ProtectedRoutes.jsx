import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export const ProtectedRoutes = ({ children }) => {

    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    if (!user.isVerified) {
        return <Navigate to='/verify-email' replace />
    }

    return children;

}
