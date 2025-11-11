import Item from "./Item";
import Resumen from "./Resumen";
import { useContext } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import { CartContext } from "../../contexts/CartContext";
import Container from "../Container"
export default function Cart() {
    const { theme } = useContext(ThemeContext);
    const { cart, setCart, isLoadingCart, isErrorCart,total,total_cant, addItemToCart, decrementarCantidad, removeFromCart} = useContext(CartContext);
    // console.log(cart);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    if (isLoadingCart) return (<Container> <div>Cargando carrito</div></Container> );
    // if (isErrorCart) return <div>Error al cargar carrito</div>
    if (cart.items.length<=0) return (<Container><div>El carrito esta vacio</div></Container>);
    return (
        <div
            className={`mt-5 mb-10 px-4 grid gap-6  
                  grid-cols-1 md:grid-cols-[2fr_1fr]`}>
            {/* Lista de ítems */}
            <ul className="space-y-4">
                <ul className="space-y-4">
                    {cart.items.map((item) => (
                        <li key={item.id_cartxitem}>
                            <Item item={item} addItemToCart={addItemToCart} decrementarCantidad={decrementarCantidad} removeFromCart={removeFromCart} />
                        </li>
                    ))}
                </ul>
            </ul>

            {/* Resumen */}
            <div className="self-start sticky top-6">
                <Resumen/>
            </div>
        </div>
    );
}
