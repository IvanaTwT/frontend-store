import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import ThemeContext from "../../contexts/ThemeContext";
const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
const selectCalificacion = [
    "Malo",
    "Regular",
    "Bueno",
    "Muy Bueno",
    "Excelente",
];
export default function ValoracionForm({addValoracion}) {
    const { token, id_cliente } = useAuth("state");
    const [estrellas, setEstrellas] = useState("");
    const { theme } = useContext(ThemeContext);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";
    const { id } = useParams();
    const [
        { data: dataPost, isError: isErrorPost, isLoading: isLoadingPost },
        doFetchPost,
    ] = useFetch(`${import.meta.env.VITE_API_BASE_URL}/valoracion/`);

    const [formData, setFormData] = useState({
        id_valoracion:0,
        id_cliente: id_cliente || 0,        
        id_producto: parseInt(id) || null,
        calificacion: "",
        estrellas: 0,
        comentario: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.calificacion || !formData.comentario) {
            toast.error("Completa todos los campos obligatorios");
            return;
        }
        if (!id_cliente) {
            toast.error("Solo los clientes logeados pueden comentar");
            return;
        }

        const estrellasSeleccionadas = selectCalificacion.indexOf(formData.calificacion) + 1;
        // console.log("estrellas: ",estrellasSeleccionadas)
        setFormData({
            ...formData,
            estrellas: parseInt(estrellasSeleccionadas),
            id_cliente: parseInt(id_cliente),
        });
        const dataForm= {...formData,
            estrellas: parseInt(estrellasSeleccionadas),
            id_cliente: parseInt(id_cliente)
            }
        doFetchPost({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(dataForm),
        });
    };

    useEffect(() => {
        if (dataPost && !isLoadingPost) {
            if (dataPost.error) toast.error(dataPost.error)
            else {
                toast.success("Comentario creado correctamente");
                const postData={
                    ...formData,
                    id_valoracion: parseInt(dataPost.id_valoracion)
                }
                // console.log("POST: ",postData)
                addValoracion(postData);
                setFormData({
                    id_valoracion:0,
                    id_cliente: parseInt(id_cliente) || null,
                    id_producto: parseInt(id) || null,
                    calificacion: "",
                    estrellas: 0,
                    comentario: "",
                });
            }
        }
    }, [dataPost, isLoadingPost]);


    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
            <select
                name="calificacion"
                value={formData.calificacion}
                onChange={handleChange}
                className={`border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${colors}`}>
                <option value="">Selecciona una calificación</option>
                {selectCalificacion.map((c, i) => (
                    <option key={i} value={c}>
                        {c}
                    </option>
                ))}
            </select>
            <textarea
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
                placeholder="Escribe tu comentario..."
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md mt-2">
                Publicar comentario
            </button>
        </form>
    );
}
