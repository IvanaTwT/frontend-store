import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Pedido from "./Pedido";
import ThemeContext from "../../contexts/ThemeContext";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import PedidoEdit from "./PedidoEdit";
import PedidoDelete from "./PedidoDelete";

export default function PedidosList() {
    const [pedidos, setPedidos] = useState([]);
    const { theme } = useContext(ThemeContext);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const navigate = useNavigate();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [{ data, isError, isLoading }, doFetchPedidos] = useFetch(
        `${import.meta.env.VITE_BACKEND_URL}/pedidos/`,
        { method: "GET" }
    );
    useEffect(() => {
        doFetchPedidos();
    }, []);

    useEffect(() => {
        if (Array.isArray(data)) {
            setPedidos(data);
        } else if (data && data.message) {
            // Si tu backend envuelve la respuesta en { message: [...] }

            setPedidos(data.message);
        } else if (data?.error) {
            toast.error(data.error, {
                position: "bottom-right",
                duration: 4000,
            });
        }
    }, [data, isError, isLoading]);

    return (
        <div className={`min-h-screen p-6 ${colors}`}>
            <h1 className="text-2xl font-semibold mb-6 text-center">
                Lista de Pedidos
            </h1>

            {isLoading ? (
                <p className="text-center text-gray-500">
                    Cargando pedidos...
                </p>
            ) : pedidos.length > 0 ? (
                <ul className="space-y-4">
                    {pedidos.map((p) => (
                        <Pedido 
                        key={p.id_pedido} 
                        pedido={p} 
                        onEdit={() => {
                                setSelectedPedido(p);
                                setShowEdit(true);
                            }}
                        onDelete={() => {
                                setSelectedPedido(p);
                                setShowDelete(true);
                            }}    
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">
                    No tienes pedidos aún
                </p>
            )}
            <Modal isOpen={showEdit} onClose={() => setShowEdit(false)}>
                    {setSelectedPedido && (
                        <PedidoEdit
                            pedido={selectedPedido}
                            onClose={() => setShowEdit(false)}
                        />
                    )}
            </Modal>
            <Modal isOpen={showDelete} onClose={() => setShowDelete(false)}>
                {setSelectedPedido && (
                    <PedidoDelete
                        pedido={selectedPedido}
                        onClose={() => setShowDelete(false)}
                    />
                )}
            </Modal>
        </div>
    );
}
