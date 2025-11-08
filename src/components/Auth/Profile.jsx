import { useAuth } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import useFetch from "../../hooks/useFetch";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Profile({ cliente = null, usuario_admin = null, setCliente=null }) {
    const { logout } = useAuth("actions"); //para deslogearse
    const { token,isAuthenticated, user_id } = useAuth("state");
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [formData, setFormData] = useState({
        username: "",
        nombre_completo: "",
        email: "",
        n_celular: "",
    });
    const id_usuario = cliente?.user_id?.user_id || usuario_admin?.id_user;
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/update/${parseInt(id_usuario)}`,
        {
            method: "PUT",
            headers: { Authorization: `Token ${token}` , "Content-Type": "application/json"},
        }
    );

    //para eliminar cuenta
    const [
        { data: dataDelete, isError: isErrorDelete, isLoading: isLoadingDelete },
        doFetchDelete,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/delete/${parseInt(id_usuario)}`,
        {
            method: "DELETE",
            headers: { Authorization: `Token ${token}` },
        }
    );

    useEffect(() => {
        if (cliente) {
            // console.log(cliente);
            setFormData((prev) => ({
                ...prev,
                username: cliente.user_id?.username || "",
                nombre_completo: cliente.nombre_completo || "",
                email: cliente.user_id?.email || "",
                n_celular: cliente.n_celular || "",
            }));
        } else if (usuario_admin) {
            setFormData((prev) => ({
                ...prev,
                username: usuario_admin.username || "",
                email: usuario_admin.email || ""
            }))
        }
    }, [cliente, usuario_admin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "n_celular") {
            // Solo números
            const regex = /^[0-9]*$/;
            if (!regex.test(value)) return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Datos enviados para el update:", formData);
        const { username, nombre_completo, email, password, n_celular } = formData;
        if (!/^[0-9]{10}$/.test(n_celular)) {
            toast.error("El número de celular debe tener exactamente 10 dígitos.");
            return;
        }
        doFetch({
            body: JSON.stringify(formData),
        });
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm(
            "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
        );
        if (confirmDelete) {
            doFetchDelete();
        }
    };
     useEffect(() => {
        if (data && !isLoading && !isError) {
            if (data.message) {
                toast.success(data.message, {
                    position: "bottom-right",
                    duration: 3500,
                });

                //  Actualizar datos del cliente
                if (cliente && setCliente) {
                    setCliente((prev) => ({
                        ...prev,
                        nombre_completo: formData.nombre_completo,
                        n_celular: formData.n_celular,
                        user_id: {
                            ...prev.user_id,
                            username: formData.username,
                            email: formData.email,
                        },
                    }));
                }
            } else if (data.error) {
                toast.error(data.error, {
                    position: "bottom-right",
                    duration: 3500,
                });
            }
        }
    }, [data, isLoading, isError]);

    useEffect(() => {
        if (dataDelete && !isLoadingDelete && !isErrorDelete) {
            if (dataDelete.message) {
                logout(); //deslogearse
                toast.success(dataDelete.message, {
                    position: "bottom-right",
                    duration: 4000,
                });
            } else {
                toast.error(dataDelete.error, {
                    position: "bottom-right",
                    duration: 4000,
                });
            }
        }
    }, [dataDelete, isLoadingDelete, isErrorDelete]);

    // console.log("ESTA autenticado? " + isAuthenticated + "user_id:" + user_id);
    return (
        <div className={`flex justify-center items-center min-h-screen m-4 shadow-[30px_4px_30px_rgba(0,0,0,0.5)`}>
            <form
                onSubmit={handleSubmit}
                className={`w-full max-w-md shadow-lg rounded-2xl p-8 space-y-6 ${colors}`}>
                <h2 className={`text-2xl font-bold text-center pr-4 ${colors}`}>
                    Perfil
                </h2>
                {/* Nombre de usuario*/}
                <div>
                    <label className={`block mb-1 ${colors}`}>
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                        required
                    />
                </div>

                {/* Nombre Completo*/}
                {cliente && (
                    <div>
                        <label className={`block  mb-1 ${colors}`}>
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            name="nombre_completo"
                            value={formData.nombre_completo}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                            required
                        />
                    </div>
                )}

                {/* Email */}
                <div>
                    <label className={`block mb-1 ${colors}`}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                        required
                    />
                </div>

                {cliente && (
                    <div>
                        <label className={`block  mb-1 ${colors}`}>
                            Numero Celular
                        </label>
                        <input
                            type="text"
                            name="n_celular"
                            value={formData.n_celular}
                            onChange={handleChange}
                            maxLength={10}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                            required
                        />
                    </div>
                )}
                {/* Botón */}
                <button
                    type="submit"
                    className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 py-2 text-white rounded-lg font-semibold transition">
                    Editar
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="cursor-pointer w-full bg-red-600 hover:bg-red-700 py-2 text-white rounded-lg font-semibold transition">
                    Dar de baja
                </button>
            </form>
        </div>
    );
}
