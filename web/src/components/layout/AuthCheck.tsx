import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function AuthCheck() {
	const { isLoading, isAuthenticated } = useAuth();
	if (isLoading) return <p>Chargement…</p>;
	return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
}
