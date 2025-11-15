import Item from "./Item";
import Resumen from "./Resumen";
import { useContext, useState, useEffect } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import { CartContext } from "../../contexts/CartContext";
import Container from "../Container";
import Modal from "../../components/Modal";
import PedidoForm from "../pedido/PedidoForm";
export default function Cart() {
    const [showModal, setShowModal] = useState(false);
    const { theme } = useContext(ThemeContext);
    const {
        cart,
        setCart,
        isLoadingCart,
        isErrorCart,
        total,
        total_cant,
        addItemToCart,
        decrementarCantidad,
        removeFromCart,
    } = useContext(CartContext);
    // console.log(cart);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    if (isLoadingCart)
        return (
            <Container>
                {" "}
                <div>Cargando carrito</div>
            </Container>
        );
    // if (isErrorCart) return <div>Error al cargar carrito</div>
    if (cart.items.length <= 0)
        return (
            <Container>
                <div>El carrito esta vacio</div>
            </Container>
        );
    return (
        <div className={`min-h-screen w-full p-4 md:p-6 ${colors}`}>
            <div
                className={`mt-5 mb-10 grid gap-6 grid-cols-1 md:grid-cols-[2fr_1fr]`}>
                {/* Items del carrito */}
                <div className="space-y-4">
                    {cart.items.map((item) => (
                        <Item
                            key={item.id_cartxitem}
                            item={item}
                            addItemToCart={addItemToCart}
                            decrementarCantidad={decrementarCantidad}
                            removeFromCart={removeFromCart}
                        />
                    ))}
                </div>

                {/* Resumen */}
                <div className="md:self-start md:sticky md:top-6">
                    <Resumen setShowModal={setShowModal} total={total} />
                </div>

                {/* Modal */}
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
        </div>
    );
}
