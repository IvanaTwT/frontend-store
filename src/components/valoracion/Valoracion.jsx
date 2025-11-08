import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import ThemeContext from "../../contexts/ThemeContext";
const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
const selectCalificacion = [
    "Malo",
    "Regular",
    "Bueno",
    "Muy Bueno",
    "Excelente",
];

export default function Valoracion({
    valoracion,
    updateValoracion = null,
    deleteValoracion = null,
}) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token, id_cliente } = useAuth("state");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingUp, setIsLoadingUp] = useState(false);
    const { theme } = useContext(ThemeContext);
    const [
        {
            data: dataUpdate,
            isError: isErrorUpdate,
            isLoading: isLoadingUpdate,
        },
        doFetchUpdate,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/valoracion/${parseInt(
            valoracion?.id_valoracion
        )}`
    );

    const [
        {
            data: dataDelete,
            isError: isErrorDelete,
            isLoading: isLoadingDelete,
        },
        doFetchDelete,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/valoracion/${parseInt(
            valoracion?.id_valoracion
        )}`
    );

    const [formData, setFormData] = useState({
        id_valoracion: parseInt(valoracion?.id_valoracion) || 0,
        id_cliente: parseInt(valoracion?.id_cliente) || id_cliente,
        id_producto: valoracion?.id_producto || null,
        calificacion: valoracion?.calificacion || "",
        estrellas: valoracion?.estrellas || 0,
        comentario: valoracion?.comentario || "",
    });

    const [estrellas, setEstrellas] = useState("");

    useEffect(() => {
        if (valoracion?.estrellas) {
            setEstrellas(stars[parseInt(valoracion.estrellas) - 1]);
        }
    }, [valoracion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const estrellasSeleccionadas =
            selectCalificacion.indexOf(formData.calificacion) + 1;

        const dataForm = { ...formData, estrellas: estrellasSeleccionadas };

        doFetchUpdate({
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(dataForm),
        });
        setIsLoadingUp(true);
    };

    useEffect(() => {
        if (dataUpdate && !isLoadingUpdate) {
            if (dataUpdate.message) {
                const estrellasSeleccionadas =
                    selectCalificacion.indexOf(formData.calificacion) + 1;

                const dataForm = {
                    ...formData,
                    estrellas: estrellasSeleccionadas,
                };
                updateValoracion(dataForm);
                toast.success("Comentario actualizado correctamente");
                setIsLoadingUp(false);
                setIsEditing(false);
            } else if (dataUpdate.error) {
                toast.error(dataUpdate.error);
            }
        }
    }, [dataUpdate, isErrorUpdate, isLoadingUpdate]);

    const handleDelete = () => {
        doFetchDelete({
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        });
    };

    useEffect(() => {
        if (!isLoadingDelete && dataDelete) {
            if (dataDelete.error) toast.error(dataDelete.error);
            else {
                toast.success("Comentario eliminado correctamente");
                deleteValoracion(formData.id_valoracion);
            }
        }
    }, [dataDelete, isErrorDelete, isLoadingDelete]);

    return (
        <div className="flex flex-col bg-gray-100 shadow-md p-5 rounded-lg border border-gray-200 hover:shadow-lg transition max-w-xl w-full">
            {/* 🔹 Botones de edición (fuera del formulario) */}
            <div className="flex justify-items-start ">
                <FaUserCircle className={` text-4xl ${theme==="light" ? "text-black-500": "text-black"}`} /> 
                <p
                    className="cursor-pointer text-black pt-2 text-1xl "
                    onClick={() =>{
                        parseInt(formData.id_cliente)=== parseInt(id_cliente) ? navigate(`/profile`)
                        : navigate(`/profile-client/${formData.id_cliente}`)
                    }                        
                    }>
                    #000{formData.id_cliente}
                </p>
            </div>
            {parseInt(id_cliente) === parseInt(valoracion?.id_cliente) &&
                !isEditing && (
                    <div className="flex justify-end gap-3 mb-3">
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md">
                            Editar
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md">
                            Eliminar
                        </button>
                    </div>
                )}

            {/* 🔹 Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Estrellas y Calificación */}
                <div className="flex items-center justify-between">
                    <p className="text-yellow-500 text-lg font-semibold">
                        {estrellas}
                    </p>
                    <select
                        name="calificacion"
                        value={formData.calificacion}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`border rounded-md p-2 text-gray-700 focus:ring focus:ring-blue-300 
                            ${
                                !isEditing
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white"
                            }
                        `}
                        required>
                        <option value="">Selecciona calificación</option>
                        {selectCalificacion.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Comentario */}
                <textarea
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Escribe tu comentario..."
                    className={`border rounded-md p-3 resize-none text-gray-700 focus:ring focus:ring-blue-300 
                        ${
                            !isEditing
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-white"
                        }
                    `}
                    required
                />

                {/* 🔹 Botones de guardar/cancelar (solo visibles al editar) */}
                {isEditing && (
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="submit"
                            disabled={isLoadingUp}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-60">
                            {isLoadingUp ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-md">
                            Cancelar
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
