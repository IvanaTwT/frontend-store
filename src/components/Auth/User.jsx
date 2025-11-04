import { useAuth } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import useFetch from "../../hooks/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

export default function User() {
    const [user, setUser] = useState(null);
    const { id_cliente } = useParams();
    const navigate = useNavigate();
    const { token, isAuthenticated } = useAuth("state");
    const { theme } = useContext(ThemeContext);

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile-client/${parseInt(
            id_cliente
        )}`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    useEffect(() => {
        if (isAuthenticated) {
            doFetch();
        }
    }, [id_cliente, isAuthenticated]);

    useEffect(() => {
        if (data && !isLoading && !isError) {
            setUser(data);
        }
    }, [data, isError, isLoading]);

    if (isLoading)
        return <p className="text-center mt-10">Cargando datos...</p>;
    if (isError || !user)
        return (
            <p className="text-center mt-10 text-red-500">
                Usuario no encontrado o eliminado.
            </p>
        );

    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    return (
        <div className={`flex justify-center items-center min-h-screen  p-4 ${colors} `}>
            <div className={` shadow-lg rounded-2xl p-6 w-full max-w-md ${colors} border`}>
                <div className="flex flex-col items-center">
                    {/* Icono de usuario */}
                    <FaUserCircle className="text-black-500 text-8xl mb-4" />

                    {/* Nombre */}
                    <h2 className="text-2xl font-semibold  mb-1">
                        {user.nombre_completo}
                    </h2>
                    <p className=" mb-4">
                        @{user.user_id.username}
                    </p>

                    <div className="w-full border-t border-gray-200 my-3"></div>

                    {/* Información */}
                    <div className="space-y-3 w-full">
                        <div className="flex justify-between">
                            <span className="font-medium ">
                                ID Cliente:
                            </span>
                            <span className="">
                                {user.id_cliente}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium ">
                                Email:
                            </span>
                            <span className="">
                                {user.user_id.email}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium ">
                                Cuenta:
                            </span>
                            <span className="">
                                {user.user_id.inhabilitada ? "Eliminada": "Activa"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300"
                            onClick={() => navigate(-1)}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
