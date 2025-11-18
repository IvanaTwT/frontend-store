import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import toast from "react-hot-toast";
import ThemeContext from "../../contexts/ThemeContext";
import { ProductContext } from "../../contexts/ProductContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import formatFecha from "../../hooks/formatFecha"
export default function PedidoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const [dataPago, setDataPago] = useState({});
    const { products, categories } = useContext(ProductContext);
    const [pedido, setPedido] = useState({});
    const [fecha, setFecha]=useState("")
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

    // --- obtener pago y comprobante ---
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/pagos/pedido/${parseInt(id)}`
    );
    useEffect(() => {
        doFetchPedido();
        doFetch();
    }, [id]);

    useEffect(() => {
        if (dataPedido && !isErrorPedido && !isLoadingPedido) {            
            setPedido(dataPedido.message || dataPedido);
        }
    }, [dataPedido, isErrorPedido, isLoadingPedido]);

    useEffect(() => {
        if(pedido){
            setFecha(formatFecha(pedido.fecha));
        }
    },[pedido])

    useEffect(() => {
        if (data && !isError && !isLoading) {
            if (data.message) return;
            setDataPago(data);
        }
    }, [data, isError, isLoading]);

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
    // id_pedido, estado,fecha, total,
    //domicilio: domicilio, codigo_postal, ciudad
    //producto, id_producto, nombre, precioxunidad, path_image, cantidad (product.cantidad * product.precioxunidad})
    //comprobante: fecha, id_comprobante, id_pago, n_comprobante
    // pago: estado, fecha, id_pago, id_pedido, metodo, monto
    function handlePdf() {
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        let y = 15;

        doc.setFontSize(18);
        doc.text("Comprobante de Pedido", 14, y);

        doc.setFontSize(11);
        doc.text(
            `N° Comprobante: ${dataPago.comprobante?.n_comprobante || "S/N"}`,
            14,
            (y += 13)
        );
        doc.text(`Estado: ${pedido.estado}`, 14, (y += 7));
        doc.text(`Fecha: ${fecha}`, 14, (y += 7));

        doc.setFontSize(12);
        doc.text("Detalles del Pago", 14, (y += 12));
        doc.setFontSize(11);
        doc.text(
            `Método de Pago: ${dataPago.pago?.metodo || "-"}`,
            14,
            (y += 8)
        );        
        doc.text(`Total: $${dataPago.pago?.monto || 0}`, 14, (y += 7));

        doc.setFontSize(12);
        doc.text("Domicilio", 130, 28);
        doc.setFontSize(11);

        domicilio?.domicilio
            ? (doc.text(`Dirección: ${domicilio.domicilio}`, 130, 35),
              doc.text(`Ciudad: ${domicilio.ciudad}`, 130, 42),
              doc.text(`Codigo Postal: ${domicilio.codigo_postal}`, 130, 49))
            : doc.text("Sin domicilio", 130, 35);

        doc.setFontSize(12);
        doc.text("Entrega", 14, (y += 12));
        doc.text(`Dias de Entrega: 1-4 días hábiles`, 14, (y += 7));
        const tableColumn = ["Producto","Categoria","Color","Talle", "Cant.", "Precio", "Subtotal"];
        const tableRows = listProducts.map((p) => [
            p.nombre,
            p.categoria_edad,
            p.color,
            p.talle,
            p.cantidad,
            `$${p.precioxunidad}`,
            `$${p.cantidad * p.precioxunidad}`,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: y + 15,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3, halign: "center" },
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
            columnStyles: { 0: { halign: "left" } },
        });

        doc.save(`comprobante_${dataPago.comprobante?.n_comprobante || id}.pdf`);
    }

    return (
        <div
            className={`flex items-center justify-center min-h-screen w-full p-2 ${colors}`}>
            <div
                className={`max-w-4xl mx-auto m-6 rounded-2xl shadow-lg p-8 border border-gray-100 ${colors}`}>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-box text-blue-600"></i> Detalle
                    del Pedido
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <p>
                            <strong>ID Pedido:</strong> #{id}
                        </p>
                        <p>
                            <strong>Estado:</strong>{" "}
                            <span className="text-blue-600">
                                {pedido.estado}
                            </span>
                        </p>
                        <p>
                            <i className="fa-solid fa-calendar text-gray-500 mr-2"></i>
                            <strong>Fecha:</strong> {fecha}
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
                <button
                    className="cursor-pointer mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors duration-200"
                    onClick={handlePdf}>
                    {" "}
                    Descargar Comprobante
                </button>
            </div>
        </div>
    );
}
