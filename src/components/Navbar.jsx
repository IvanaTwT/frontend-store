import { useContext, useEffect, useState } from "react";
import { TbShoppingBag, TbShoppingCart } from "react-icons/tb";
import { BiShoppingBag } from "react-icons/bi"
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../contexts/ThemeContext";
import { CartContext } from "../contexts/CartContext";
import toast from "react-hot-toast";
export default function Navbar() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { total_cant } = useContext(CartContext);
    const { token, isAuthenticated, user_id, is_admin, id_cliente } =useAuth("state"); 
    const { logout } = useAuth("actions"); //para deslogearse
    //cerrar session en el backend
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
        }
    );
    const [active, setActive] = useState("is-active");
    const handleActive = () => {
        setActive(active === "is-active" ? "is-static" : "is-active");
    };
    const navigate = useNavigate();

    const colors =
        theme === "light"
            ? "bg-slate-200 from-slate-200 to-dark-200 text-gray-900"
            : "bg-gradient-to-br from-slate-800 to-gray-800 text-white";

    function handleLogout() {
        doFetch();
    }
    useEffect(() => {
        if (data) {
            // console.log("Respuesta del backend:", data);
            if (data.message) {
                toast.success(data.message, {
                    position: "bottom-right",
                    duration: 4000,
                }); // "Sesion cerrada"
                logout();
            } else if (data.error) {
                toast.error(data.error, {
                    position: "bottom-right",
                    duration: 4000,
                });
            }
        }
    }, [data, isError, isLoading]);

    return (
        <nav
            className={`navbar w-full shadow-md ${colors}`}
            role="navigation"
            aria-label="main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a className="flex items-center gap-2 cursor-pointer" onClick={()=> navigate("/")}>
                            <BiShoppingBag className="icon h-8 w-8"></BiShoppingBag>
                            <span className="font-bold text-lg">Unique Style</span>
                        </a>
                    </div>

                    {/* Links (desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a
                            href="#"
                            className="hover:underline"
                            onClick={() => navigate("/")}>
                            Inicio
                        </a>
                        <a
                            href="#"
                            className="hover:underline"
                            onClick={() => navigate("/products")}>
                            Ver Productos
                        </a>
                        <a
                            href="#"
                            className="hover:underline"
                            onClick={() => navigate("/contact")}>
                            Contactanos
                        </a>
                    </div>

                    {/* Botones */}
                    <div className="hidden md:flex items-center space-x-3">
                        <button
                            onClick={toggleTheme}
                            className="px-3 py-1 rounded cursor-pointer">
                            {theme === "light" ? (
                                <i className="fa-solid fa-sun fa-lg text-yellow-400"></i>
                            ) : (
                                <i className="fa-solid fa-moon fa-flip-horizontal"></i>
                            )}
                        </button>
                        {/* Icono de perfil */}
                        {user_id && !id_cliente && (
                            <a
                                onClick={() => navigate("/admin-dashboard")}
                                className="cursor-pointer">
                                <i className={`fa-lg fa-solid fa-user-tie`}></i>
                            </a>
                        )}
                        {id_cliente && (
                            <a
                                onClick={() => navigate("/profile")}
                                className="cursor-pointer">
                                <i className={`fa-lg fa-regular fa-user`}></i>
                            </a>
                        )}
                        {/* {Carrito} */}
                        {id_cliente && (
                            <div className="flex align-items-center relative">
                                <TbShoppingCart
                                    onClick={() => navigate("/mi-carrito")}
                                    className="icon-cart text-3xl cursor-pointer transform scale-x-[-1]"></TbShoppingCart>
                                <span className="flex items-center justify-center w-5 h-5 text-xs font-medium absolute bottom-4 left-0 bg-red-500 text-white rounded-full">
                                    {total_cant}
                                </span>
                            </div>
                        )}

                        {/* Botón Sign up (solo si no está logueado) */}
                        {!isAuthenticated && (
                            <a
                                onClick={() => navigate("/signup")}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                Sign up
                            </a>
                        )}

                        {/* Botón Login / Logout */}
                        <a
                            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-sky-700 cursor-pointer"
                            onClick={() =>
                                isAuthenticated
                                    ? handleLogout()
                                    : navigate("/login")
                            }>
                            {isAuthenticated ? "Logout" : "Log in"}
                        </a>
                    </div>

                    {/* Burger menu (mobile) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setActive(!active)}
                            className="focus:outline-none">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                {active ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu móvil */}
            {active && (
                <div className={`md:hidden px-4 pb-4 space-y-2 ${colors}`}>
                    <a
                        href="#"
                        className="block hover:underline"
                        onClick={() => navigate("/")}>
                        Inicio
                    </a>
                    <a
                        href="#"
                        className="block hover:underline"
                        onClick={() => navigate("/products")}>
                        Ver Productos
                    </a>
                    <a href="#" className="block hover:underline" onClick={() => navigate("/contact")}>
                        Contactanos
                    </a>
                    

                       
                    <div className="flex gap-2 pt-2">
                        {/* Icono de perfil */}
                        <button
                            onClick={toggleTheme}
                            className="mb-4 rounded cursor-pointer">
                            {theme === "light" ? (
                                <i className="fa-solid fa-sun fa-lg text-yellow-400"></i>
                            ) : (
                                <i className="fa-solid fa-moon fa-flip-horizontal"></i>
                            )}
                        </button>
                        {user_id && !id_cliente && (
                            <a
                                onClick={() => navigate("/admin-dashboard")}
                                className="cursor-pointer">
                                <i className={`fa-lg fa-solid fa-user-tie`}></i>
                            </a>
                        )}
                        {id_cliente && (
                            <a
                                onClick={() => navigate("/profile")}
                                className="cursor-pointer">
                                <i className={`fa-lg fa-regular fa-user`}></i>
                            </a>
                        )}
                        {/* {Carrito} */}
                        {id_cliente && (
                            <div className="flex align-items-center relative">
                                <TbShoppingCart
                                    onClick={() => navigate("/mi-carrito")}
                                    className="icon-cart text-3xl cursor-pointer transform scale-x-[-1]"></TbShoppingCart>
                                <span className="flex items-center justify-center w-5 h-5 text-xs font-medium absolute bottom-4 left-0 bg-red-500 text-white rounded-full">
                                    {total_cant}
                                </span>
                            </div>
                        )}
                        {!isAuthenticated && (
                            <a
                                onClick={() => navigate("/signup")}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                Sign up
                            </a>
                        )}
                        <a
                            className="flex-1 px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-sky-700 cursor-pointer"
                            onClick={() =>
                                isAuthenticated
                                    ? handleLogout()
                                    : navigate("/login")
                            }>
                            {isAuthenticated ? "Logout" : "Log in"}
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
