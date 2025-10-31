import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Inicio from "../components/Inicio";
import Login from "../components/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../components/Auth/Signup";
const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                children: [
                    {
                        index: true,
                        element: <Inicio />,
                    },
                ],
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            }
        ],
    },
]);

export default Router;
