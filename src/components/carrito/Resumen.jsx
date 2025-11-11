import { useContext, useState, useEffect } from "react"; 
import ThemeContext from "../../contexts/ThemeContext";
import { CartContext } from "../../contexts/CartContext";
import Modal from "../../components/Modal";
import PedidoForm from "../pedido/PedidoForm"
export default function Resumen() {
    const { cart, setCart, total, total_cant } = useContext(CartContext);
    const [ showModal, setShowModal]= useState(false)
    const { theme } = useContext(ThemeContext);
    const [isDisabled, setIsDisabled] = useState(true);

    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    useEffect(() => {
        // si no hay items en el carrito, desactiva el botón
        if (cart?.items && cart.items.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [cart]);

    function handlePedido() {
        // lógica para enviar pedido
        setShowModal(true)
    }

    return (
        <div className={`m-3 w-[260px] ${colors} rounded-lg shadow-md p-5`}>
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-2">
                Sumatoria
            </h2>

            <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Sub Total</span>
                <span className="text-xl font-semibold">${total}</span>
            </div>

            <div className="flex justify-between items-center mb-3 uppercase font-medium">
                <span>Cantidad</span>
                <span>{total_cant}</span>
            </div>

            <div className="flex justify-between items-center text-lg font-bold uppercase">
                <span>Total</span>
                <span>${total}</span>
            </div>

            <button
                onClick={handlePedido}
                disabled={isDisabled}
                className={`w-full mt-3 font-semibold py-2 rounded-lg uppercase transition-colors
                    ${isDisabled
                        ? "bg-gray-400 cursor-not-allowed text-gray-100"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    }`}
            >
                Realizar Pedido
            </button>
            
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    {showModal && (
                        <PedidoForm
                            cart={cart}
                            total={total}
                            setCart={setCart}
                            onClose={() => setShowModal(false)}
                        />
                    )}
            </Modal>

        </div>
    );
}
