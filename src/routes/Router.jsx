import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Inicio from "../components/Inicio";
import Login from "../components/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../components/Auth/Signup";
import ContactForm from "../components/ContactoForm" 
import ProductList from "../components/products/ProductList";
import ProductDetail from "../components/products/ProductDetail";
import ClientDashboard from "../components/Auth/ClientDashboard"
import Profile from "../components/Auth/Profile";
import Cart from "../components/carrito/Cart"
import PedidoDetail from "../components/pedido/PedidoDetail"
import User from "../components/Auth/User"
import AdminDashboard from "../components/Auth/AdminDashboard";
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
            {
                path: "/products",
                children: [
                    {
                        index: true,
                        element: <ProductList />,
                    },
                    {
                        path: ":id",
                        element: <ProductDetail />,
                    },
                ],
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <ClientDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile/:id",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path:"/mi-carrito",
                element:(
                    <ProtectedRoute>
                        <Cart/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/pedido/:id",
                element: (
                    <ProtectedRoute>
                        <PedidoDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile-client/:id_cliente",
                element: (
                    <ProtectedRoute>
                        <User/>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin-dashboard",
                element: (
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default Router;
