import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import toast from "react-hot-toast";
import ThemeContext from "../../contexts/ThemeContext";
import { ProductContext } from "../../contexts/ProductContext";

export default function PedidoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { products , categories } = useContext(ProductContext); 

    const [pedido, setPedido] = useState({});
    const [domicilio, setDomicilio] = useState({});
    const [listProducts, setListProducts] = useState([]);

    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    // --- obtener pedido ---
    const [
        {
            data: dataPedido,
            isError: isErrorPedido,
            isLoading: isLoadingPedido,
        },
        doFetchPedido,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/pedidos/by-id/${parseInt(id)}`
    );

    useEffect(() => {
        doFetchPedido();
    }, [id]);

    useEffect(() => {
        if (dataPedido && !isErrorPedido && !isLoadingPedido) {
            setPedido(dataPedido.message || dataPedido);
        }
    }, [dataPedido, isErrorPedido, isLoadingPedido]);

    //  obtener domicilio 
    useEffect(() => {
        if (!pedido?.id_domicilio) return;

        const obtenerDomicilio = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/addresses/${
                        pedido.id_domicilio
                    }`
                );
                if (!res.ok) throw new Error("Error al obtener domicilio");
                const data = await res.json();
                setDomicilio(data.message || data);
            } catch (error) {
                // console.error(error);
                toast.error("No se pudo obtener el domicilio", {
                    position: "bottom-right",
                });
            }
        };

        obtenerDomicilio();
    }, [pedido.id_domicilio]);

    // buscar productos desde el contexto 
    useEffect(() => {
        if (!pedido?.items?.length || !products?.length) return;

        const encontrados = pedido.items
            .map((item) => {
                const producto = products.find(
                    (p) => p.id_producto === item.id_producto
                );

                const categoria = categories.find(
                    (c) =>
                        parseInt(c.id_categoria) ===
                        parseInt(producto.id_categoria.id_categoria)
                );

                return producto
                    ? {
                          ...producto,
                          nombre: categoria.nombre,
                          cantidad: item.cantidad,
                          precioxunidad: item.precioxunidad,
                      }
                    : null;
            })
            .filter(Boolean);

        setListProducts(encontrados);
    }, [pedido.items, products]);

    if (isLoadingPedido)
        return (
            <p className="text-center mt-10 text-gray-500">
                Cargando pedido...
            </p>
        );

    if (isErrorPedido)
        return (
            <p className="text-center mt-10 text-red-500">
                Error al cargar el pedido.
            </p>
        );

    return (
        <div className={`flex items-center justify-center min-h-screen w-full p-2 ${colors}`}>
            <div className={`max-w-4xl mx-auto m-6 rounded-2xl shadow-lg p-8 border border-gray-100 ${colors}`}>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-box text-blue-600"></i> Detalle del Pedido
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <p>
                            <strong>ID Pedido:</strong> #{id}
                        </p>
                        <p>
                            <strong>Estado:</strong>{" "}
                            <span className="text-blue-600">{pedido.estado}</span>
                        </p>
                        <p>
                            <i className="fa-solid fa-calendar text-gray-500 mr-2"></i>
                            <strong>Fecha:</strong> {pedido.fecha}
                        </p>
                        <p>
                            <i className="fa-solid fa-dollar-sign text-green-600 mr-2"></i>
                            <strong>Total:</strong> ${pedido.total}
                        </p>
                    </div>

                    <div className="rounded-xl p-4 border border-gray-300">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <i className="fa-solid fa-home text-orange-500"></i>{" "}
                            Domicilio
                        </h3>
                        {domicilio?.domicilio ? (
                            <>
                                <p>
                                    <strong>Dirección:</strong>{" "}
                                    {domicilio.domicilio}
                                </p>
                                <p>
                                    <strong>Ciudad:</strong> {domicilio.ciudad}
                                </p>
                                <p>
                                    <strong>Código Postal:</strong>{" "}
                                    {domicilio.codigo_postal}
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-400 italic">
                                No se encontró domicilio asociado.
                            </p>
                        )}
                    </div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                    <i className="fa-solid fa-bag-shopping text-indigo-500"></i>{" "}
                    Productos
                </h3>

                {listProducts.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {listProducts.map((product, index) => (
                            <li
                                key={index}
                                onClick={() =>
                                    navigate(`/products/${product.id_producto}`)
                                }
                                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer">
                                {product.path_image ? (
                                    <img
                                        src={product.path_image}
                                        alt={product.nombre}
                                        className="w-full h-40 object-cover rounded-md mb-3"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-3 text-gray-500 italic">
                                        Imagen no disponible
                                    </div>
                                )}
                                <h4 className="text-lg font-semibold text-gray-800">
                                    {product.nombre}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Cantidad: {product.cantidad}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Precio: ${product.precioxunidad}
                                </p>
                                <p className="font-medium text-gray-800 mt-2">
                                    Subtotal: $
                                    {product.cantidad * product.precioxunidad}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 italic">
                        No hay productos en este pedido.
                    </p>
                )}
        </div>
    </div>
    );
}
