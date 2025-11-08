import { useState, useContext, useEffect } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import useFetch from "../../hooks/useFetch";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import Profile from "./Profile";
import Pedido from "../pedido/Pedido";
import Container from "../Container";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function ClientDashboard() {
    const { token, id_cliente, is_admin } = useAuth("state");
    const { theme } = useContext(ThemeContext);
    const [selectedView, setSelectedView] = useState("Ver Perfil"); // "perfil" | "pedidos"
    const [cliente, setCliente] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const navigate = useNavigate();
    if (is_admin === 1) {
        navigate("/admin-dashboard");
    }
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const views_client = ["Ver Perfil", "Editar Perfil", "Mis Pedidos"];
    // fetch perfil
    const [
        { data: dataCliente, isError: errorCliente, isLoading: loadingCliente },
        doFetchCliente,
    ] = useFetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
        method: "GET",
        headers: { Authorization: `Token ${token}` },
    });

    // fetch pedidos
    const [
        { data: dataPedidos, isError: errorPedidos, isLoading: loadingPedidos },
        doFetchPedidos,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/pedidos/all/${parseInt(
            id_cliente
        )}`,
        {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
        }
    );

    useEffect(() => {
        doFetchCliente();
        doFetchPedidos();
    }, []);

    useEffect(() => {
        if (dataCliente && !errorCliente && !loadingCliente) {
            setCliente(dataCliente);
        } else if (dataCliente?.error) {
            toast.error(dataCliente.error, {
                position: "bottom-right",
                duration: 4000,
            });
        }
    }, [dataCliente, errorCliente, loadingCliente]);

    useEffect(() => {
        if (Array.isArray(dataPedidos)) {
            // Caso normal: devuelve lista (vacía o con pedidos)
            setPedidos(dataPedidos);
        } else if (dataPedidos && dataPedidos.message) {
            // Si tu backend envuelve la respuesta en { message: [...] }
            // console.log("Datos pedidos mios: ",dataPedidos.message)
            setPedidos(dataPedidos.message);
        } else if (dataPedidos?.error) {
            // Caso de error real
            setPedidos([]);
            toast.error(dataPedidos.error, {
                position: "bottom-right",
                duration: 4000,
            });
        }
    }, [dataPedidos]);

    if (loadingCliente || loadingPedidos)
        return (
            <div>
                <p>Cargando...</p>
            </div>
        );
    if (errorCliente)
        return (
            <Container>
                {" "}
                <p>Error al cargar el perfil </p>
            </Container>
        );

    return (
        <div className={`flex flex-col h-screen p-1  ${colors}`}>
            {/* Fila : sidebar + vista */}
            <div className={`flex flex-1 overflow-hidden ${colors}`}>
                <aside
                    className={`w-1/5 bg-gradient-to-r mr-1 p-4 overflow-y-auto ${colors} shadow-[0px_3px_3px_rgba(0,0,0,0.5)]`}>
                    <ul className="space-y-2">
                        {views_client && views_client.length > 0 ? (
                            views_client.map((vista, index) => (
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

                {/* Contenedor para colocar el perfil del cliente o bien sus pedidos si tiene  scrollable */}
                <main className={`flex-1 overflow-y-auto p-1 ${colors}`}>
                    {selectedView === "Ver Perfil" ? (
                        cliente ? (
                            <div className={`flex justify-center items-center m-4 shadow-[30px_4px_30px_rgba(0,0,0,0.5)`}>
                                <div className="flex flex-col items-center w-full max-w-md shadow-lg rounded-2xl p-8 space-y-6 shadow-[0px_4px_30px_rgba(0,0,0,0.5)">
                                    {/* Icono de usuario */}
                                    <FaUserCircle className="text-black-500 text-8xl mb-4" />

                                    {/* Nombre */}
                                    <h2 className="text-2xl font-semibold  mb-1">
                                        {cliente.nombre_completo}
                                    </h2>
                                    <p className=" mb-4">
                                        @{cliente.user_id.username}
                                    </p>

                                    <div className="w-full border-t border-gray-200 my-3"></div>

                                    {/* Información */}
                                    <div className="space-y-3 w-full">
                                        <div className="flex justify-between">
                                            <span className="font-medium ">
                                                ID Cliente:
                                            </span>
                                            <span className="">
                                                {cliente.id_cliente}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium ">
                                                Email:
                                            </span>
                                            <span className="">
                                                {cliente.user_id.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium ">
                                                Cuenta:
                                            </span>
                                            <span className="">
                                                {cliente.user_id.inhabilitada
                                                    ? "Eliminada"
                                                    : "Activa"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Cargando perfil...</p>
                        )
                    ) : selectedView === "Editar Perfil" ? (
                        cliente ? (
                            <Profile
                                cliente={cliente}
                                setCliente={setCliente}
                            />
                        ) : (
                            <p>Cargando perfil...</p>
                        )
                    ) : selectedView === "Mis Pedidos" ? (
                        pedidos.length > 0 ? (
                            <ul className={`space-y-4 ${colors}`}>
                                {pedidos.map((p) => (
                                    <Pedido key={p.id_pedido} pedido={p} />
                                ))}
                            </ul>
                        ) : (
                            <p>No tienes pedidos aún</p>
                        )
                    ) : (
                        <p>Selecciona una vista</p>
                    )}
                </main>
            </div>
        </div>
    );
}
