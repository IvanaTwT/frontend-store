import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Inicio from "../components/Inicio";
import Login from "../components/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../components/Auth/Signup";
import ContactForm from "../components/ContactoForm" 
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
            },
            {
                path: "/contact",
                element: (
                    <ProtectedRoute>
                        <ContactForm/>
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default Router;
