import useFetch from "../../hooks/useFetch";
import ThemeContext from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductContext } from "../../contexts/ProductContext";
export default function PedidoForm({ cart, setCart, total, onClose }) {
    const { token, id_cliente } = useAuth("state");
    const { theme } = useContext(ThemeContext);
    const { disminuirStock } = useContext(ProductContext);
    const pago_metodo= ["mercado pago", "efectivo"];//"mercado pago", "efectivo" , "50-50"
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [
        { data: dataPost, isError: isErrorPost, isLoading: isLoadingPost },
        doFetchPost,
    ] = useFetch(`${import.meta.env.VITE_API_BASE_URL}/pedidos/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/addresses/client/${parseInt(
            id_cliente
        )}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    useEffect(() => {
        doFetch();
    }, []);

    useEffect(() => {
        if (data && !isLoading && !isError) {
            setFormData((prev) => ({
                ...prev,
                domicilio: data.message.domicilio,
            }));
        }
    }, [data, isLoading, isError]);

    const [formData, setFormData] = useState({
        id_carrito: parseInt(cart.id_carrito),
        id_cliente: id_cliente,
        total: parseInt(total),
        domicilio: "",
        items: cart.items,
        estado:"pendiente",
        metodo:""
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
        // console.log("Form Pedido POST: ", formData);
        if (formData.domicilio.length <= 15) {
            toast.error("El domicilio debe tener al menos 15 caracteres.");
            return;
        }
        doFetchPost({
            body: JSON.stringify(formData),
        });
    };

    useEffect(() => {
        if (dataPost && !isLoadingPost) {
            if (dataPost.error) {
                toast.error(dataPost.error);
            } else {
                toast.success("Pedido creado correctamente");
                // actualizamos el stock de los productos qu el usuario va a comprar
                cart.items.forEach((item) => {
                    disminuirStock(item.id_producto, item.cantidad);
                });
                onClose(); // Cierra el modal
                setCart({ id_carrito: cart.id_carrito, items: [] });
            }
        }
    }, [dataPost, isLoadingPost, isErrorPost]);

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full p-4 rounded-2xl space-y-4 space-x-5 ${colors}`}>
            <h2 className="text-2xl font-semibold mb-2 text-center">
                Crear Pedido
            </h2>

            {/* Domicilio */}
            <div>
                <label className="block mb-1 font-medium">Domicilio</label>
                <input
                    type="text"
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa tu domicilio..."
                />
            </div>
            {/*metodo de pago */}
            <div>
                    <label className="block mb-1 font-medium">Metodo de pago(El metodo de pago debera ser abonado al momento de recibir la compra)</label>
                    <select
                        name="metodo"
                        value={formData.metodo}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${colors}`}>
                        <option value="">Seleccionar</option>
                        {pago_metodo.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            {/* Productos */}
            <div>
                <h2 className="font-semibold text-lg mb-2">Productos</h2>
                <ul className="space-y-4">
                    {cart?.items?.length > 0 ? (
                        cart.items.map((item) => (
                            <li key={item.id_cartxitem}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-300 py-3 px-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                    {/* Imagen */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.nombre}
                                                className="w-full h-full object-cover"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/not-found.png")
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Nombre */}
                                    <div className="sm:w-24 text-center font-semibold text-gray-700 truncate">
                                        {/* {item.nombre} */}{" "}
                                    </div>

                                    {/* Precio */}
                                    <div className="sm:w-24 text-center font-semibold text-gray-700">
                                        ${item.precio}
                                    </div>

                                    {/* Cantidad */}
                                    <div className="sm:w-28 flex items-center justify-center gap-2">
                                        <span className="w-8 text-center font-medium text-gray-800">
                                            {item.cantidad}
                                        </span>
                                    </div>

                                    {/* Total */}
                                    <div className="sm:w-24 text-center font-semibold text-gray-800">
                                        ${item.cantidad * item.precio}
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-600 text-center py-4">
                            No hay productos en el carrito.
                        </li>
                    )}
                </ul>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold uppercase">
                <span>Total</span>
                <span>${total}</span>
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400">
                {!isLoadingPost ? "Cargando..." : "Guardar Pedido"}
            </button>
        </form>
    );
}
