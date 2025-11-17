import { useState, useContext, useEffect } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import ProductForm from "../products/ProductForm";
import VerProductos from "../products/VerProductos";
import PedidosList from "../pedido/PedidosList";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { FaUserCircle } from "react-icons/fa";
export default function AdminDashboard() {
    const { token, user_id, is_admin } = useAuth("state");
    const { theme } = useContext(ThemeContext);
    const [selectedView, setSelectedView] = useState("Ver Productos");
    const [user, setUser] = useState();
    const [menuOpen, setMenuOpen] = useState(false);
    const views = ["Ver Perfil", "Crear Producto", "Ver Productos", "Pedidos"];
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";
    const navigate = useNavigate();
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile`,
        {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
        }
    );

    useEffect(() => {
        doFetch();
    }, []);

    useEffect(() => {
        if (data && !isError && !isLoading) {
            setUser(data);
        } else if (data?.error) {
            toast.error(dataCliente.error, {
                position: "bottom-right",
                duration: 4000,
            });
        }
    }, [data, isError, isLoading]);

    if (parseInt(is_admin) === 0)
        return (
            <div className={`min-h-screen p-6 text-center flex justify-center`}>
                No tienes acceso a esta página
            </div>
        );

    return (
        <div className={`flex flex-col h-screen p-1  ${colors}`}>
            {/* Fila : sidebar + vista */}
            <div className={`flex flex-1 overflow-hidden ${colors} `}>
                {/* Sidebar de navegacion PC*/}
                <aside
                    className={`hidden md:block w-1/5 m-1 p-4 overflow-y-auto ${colors} shadow-[0px_3px_3px_rgba(0,0,0,0.5)]`}>
                    <ul className="space-y-2">
                        {views && views.length > 0 ? (
                            views.map((vista, index) => (
                                <li
                                    key={index}
                                    className={`text-center cursor-pointer px-3 py-2  rounded-md ${
                                        selectedView === vista
                                            ? `${
                                                  theme === "light"
                                                      ? "bg-teal-500 text-black"
                                                      : "bg-gray-400  text-white"
                                              }`
                                            : `${
                                                  theme === "light"
                                                      ? "hover:bg-gray-300 text-black"
                                                      : "hover:bg-gray-300 text-white"
                                              }`
                                    }`}
                                    onClick={() => setSelectedView(vista)}>
                                    {vista}
                                </li>
                            ))
                        ) : (
                            <li>No tiene vistas para mostrar</li>
                        )}
                    </ul>
                </aside>
                {/* BOTÓN BURGER MOBILE */}
                <div className="md:hidden absolute top-56 left-2 z-20">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 bg-gray-800 text-white rounded">
                        {menuOpen ? (
                            <i className="fa-solid fa-xmark text-xl"></i>
                        ) : (
                            <i className="fa-solid fa-bars text-xl"></i>
                        )}
                    </button>
                </div>
                {/* MENU MOBILE DESPLEGABLE */}
                {menuOpen && (
                    <div
                        className={`md:hidden fixed top-0 left-0 w-2/3 h-full p-4 shadow-lg z-30 ${colors}`}>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-2 right-4 p-2 bg-gray-800 text-white rounded">
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                        <ul className="space-y-2">
                            {views && views.length > 0 ? (
                                views.map((vista, index) => (
                                    <li
                                        key={index}
                                        className={`text-center cursor-pointer px-3 py-2  rounded-md ${
                                            selectedView === vista
                                                ? `${
                                                      theme === "light"
                                                          ? "bg-teal-500 text-black"
                                                          : "bg-gray-400  text-white"
                                                  }`
                                                : `${
                                                      theme === "light"
                                                          ? "hover:bg-gray-300 text-black"
                                                          : "hover:bg-gray-300 text-white"
                                                  }`
                                        }`}
                                        onClick={() => setSelectedView(vista)}>
                                        {vista}
                                    </li>
                                ))
                            ) : (
                                <li>No tiene vistas para mostrar</li>
                            )}
                        </ul>
                    </div>
                )}
                {/* Contenedor para colocar el ver producto, crear, y ver pedidos  (scrollable) */}
                <main className="flex-1 overflow-y-auto p-1">
                    {selectedView === "Ver Perfil"  ? (
                        user ? (
                        <div
                            className={`flex justify-center items-center  m-4 shadow-[30px_4px_30px_rgba(0,0,0,0.5)`}>
                            <div
                                className={` shadow-lg rounded-2xl p-6 w-full max-w-md ${colors}`}>
                                <div className="flex flex-col items-center">
                                    {/* Icono de usuario */}
                                    <FaUserCircle className="text-black-500 text-8xl mb-4" />
                                    {/* Nombre */}
                                    <h2 className="text-2xl font-semibold  mb-1">
                                        @{user.username}
                                    </h2>
                                    <div className="w-full border-t border-gray-200 my-3"></div>
                                    <div className="space-y-3 w-full">
                                        <div className="flex justify-between">
                                            <span className="font-medium ">
                                                Email:
                                            </span>
                                            <span className="">
                                                {user.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium ">
                                                Cuenta:
                                            </span>
                                            <span className="">
                                                {user.inhabilitada
                                                    ? "Eliminada"
                                                    : "Activa"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ): (<div>Cargando perfil...</div>)
                    ) : selectedView === "Crear Producto" ? (
                        <ProductForm />
                    ) : selectedView === "Ver Productos" ? (
                        <VerProductos />
                    ) : (
                        <PedidosList />
                    )}
                </main>
            </div>
        </div>
    );
}
