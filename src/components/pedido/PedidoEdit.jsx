// src/components/products/ProductEdit.jsx
import useFetch from "../../hooks/useFetch";
import ThemeContext from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PedidoEdit({ pedido, onClose }) {
    const { token, user_id } = useAuth("state");
    const { theme } = useContext(ThemeContext);
    const estados=['pendiente','pagado','cancelado'];
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [
        {
            data: dataUpdate,
            isError: isErrorUpdate,
            isLoading: isLoadingUpdate,
        },
        doFetchUpdate,
    ] = useFetch(`${import.meta.env.VITE_BACKEND_URL}/pedidos/update-estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    const [formData, setFormData] = useState({
        id_pedido: parseInt(pedido.id_pedido),
        estado: pedido.estado,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Form Pedido Update: ", formData);
        doFetchUpdate({
            body: JSON.stringify(formData),
        });
    };
    


    useEffect(() => {
        if (dataUpdate && !isLoadingUpdate) {
            if (dataUpdate.error) {
                toast.error(dataUpdate.error);
            } else {
                toast.success("Pedido actualizado correctamente");
                onClose(); // Cierra el modal
            }
        }
    }, [dataUpdate, isLoadingUpdate, isErrorUpdate]);

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full p-4 rounded-2xl space-y-4 ${colors}`}>
            <h2 className="text-2xl font-semibold mb-2 text-center">
                Editar Pedido #{pedido.id_pedido}
            </h2>

            {/* estado*/}
            <div>
                <label className="block mb-1 font-medium">
                    Estado
                </label>
                <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${colors}`}>
                    <option value="">Seleccionar</option>
                    {estados.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                {!isLoadingUpdate ? "Actualizando..." : "Guardar Cambios"}
            </button>
        </form>
    );
}
