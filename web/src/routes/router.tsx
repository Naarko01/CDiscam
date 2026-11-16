import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import AuthCheck from "../components/layout/AuthCheck";
import SignupPage from "../pages/SignupPage";

export const router = createBrowserRouter([
	{
		element: <AuthCheck />,
		children: [],
	},
	{ path: "/", element: <App /> },
	{ path: "/signup", element: <SignupPage /> },
	{ path: "/login", element: <LoginPage /> },
]);
