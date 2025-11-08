import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { ProductContext } from "./ProductContext";
export const CartContext = createContext();

export default function CartProvider({ children }) {
    const { id_cliente } = useAuth("state");
    const {
        products,
        verifyStock,
        disminuirStock,
        categories,
        isLoadingProducts,
        isErrorProducts,
    } = useContext(ProductContext);
    const [cart, setCart] = useState({ items: [] });
    // const [items, setItems] = useState([]);
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const [isErrorCart, setIsErrorCart] = useState(false);

    useEffect(() => {
        if (!id_cliente) return; // seguridad

        const fetchCart = async () => {
            try {
                setIsLoadingCart(true);

                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/carts/${parseInt(
                        id_cliente
                    )}`
                );
                const data = await res.json();

                // Si existe carrito
                if (data?.message) {
                    //fecha, id_carrito, id_cliente, items= [{...},{...}]
                    setCart(data.message);
                    // setItems(data.message.items)
                    //console.log(data.message);
                } else {
                    // Si no existe, lo creamos
                    const createCart = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/carts/add`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                id_cliente: parseInt(id_cliente),
                            }),
                        }
                    );

                    if (!createCart.ok)
                        throw new Error("Error al crear carrito");

                    const new_cart = await createCart.json();
                    setCart({ id_carrito: new_cart.id_carrito, items: [] });
                }
            } catch (err) {
                console.error("Error cargando carrito:", err);
                setIsErrorCart(true);
            } finally {
                setIsLoadingCart(false);
            }
        };

        fetchCart();
    }, [id_cliente]);

    useEffect(() => {
        if (!products || (!cart?.items?.length && !categories)) return;
        // console.log(categories);
        const updatedItems = cart.items.map((item) => {
            const product = products.find(
                (p) => p.id_producto === item.id_producto
            );
            // console.log("PRoducto: ", product);
            const categoria = categories.find(
                (c) =>
                    parseInt(c.id_categoria) ===
                    parseInt(product.id_categoria.id_categoria)
            );

            if (!product) return item;
            return {
                ...item,
                id_categoria: parseInt(categoria.id_categoria),
                nombre: categoria?.nombre,
                color: product.color,
                precio: product.precio,
                image: product.path_image,
                talle: product.talle,
            };
        });

        const isDifferent =
            JSON.stringify(cart.items) !== JSON.stringify(updatedItems);
        if (isDifferent) {
            setCart((prev) => ({ ...prev, items: updatedItems }));
        }
    }, [products, cart.items, categories]);

    //  Agregar item al carrito
    const addItemToCart = async (product) => {
        if (!cart.id_carrito) return;

        // Buscar el stock disponible del producto en el ProductContext
        const productStock =
            products.find((p) => p.id_producto === product.id_producto)
                ?.stock || 0;

        // 1. Verificar si el producto ya está en el carrito
        const exist_product = cart.items.find(
            (el) => el.id_producto === product.id_producto
        );

        let newQuantity = 1;
        let currentQuantity = 0;

        if (exist_product) {
            // Ya existe, calculamos la cantidad futura
            currentQuantity = exist_product.cantidad;
            newQuantity = currentQuantity + 1;

            // 🚨 VERIFICACIÓN DE STOCK (INCREMENTO)
            if (!verifyStock(product.id_producto, newQuantity)) {
                alert(
                    `No hay suficiente stock. Solo quedan ${productStock} unidades.`
                );
                return; // Detener si no hay stock para el incremento
            }

            // Si hay stock, actualizamos la cantidad en la API y localmente
            await updateCantidad(exist_product.id_cartxitem, newQuantity);
            return;
        }

        // VERIFICACIÓN DE STOCK (NUEVO ITEM)
        if (!verifyStock(product.id_producto, 1)) {
            alert(`No hay stock disponible de este producto.`);
            return; // Detener si no hay stock
        }

        // Si es un nuevo producto y hay stock...
        try {
            // ... (Tu código actual para agregar el item a la API)
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/carts/add-item`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_carrito: parseInt(cart.id_carrito),
                        id_producto: parseInt(product.id_producto),
                        cantidad: 1,
                    }),
                }
            );

            if (!res.ok)
                throw new Error("Error al agregar producto al carrito");
            const newItem = await res.json();

            setCart((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        ...product,
                        cantidad: 1,
                        id_cartxitem: newItem.id_cartxitem,
                    },
                ],
            }));
        } catch (err) {
            console.error("Error al agregar item:", err);
        }
    };

    // Actualizar cantidad de un producto
    const updateCantidad = async (id_cartxitem, nuevaCantidad) => {
        if (!cart.id_carrito || nuevaCantidad < 1) return;

        // 1. Obtener el id_producto asociado al id_cartxitem
        const itemToUpdate = cart.items.find(
            (item) => item.id_cartxitem === id_cartxitem
        );
        if (!itemToUpdate) return;
        const { id_producto } = itemToUpdate;

        // 🚨 VERIFICACIÓN DE STOCK
        if (!verifyStock(id_producto, nuevaCantidad)) {
            // Puedes optar por no actualizar y notificar, o actualizar a la cantidad máxima disponible.
            const productStock =
                products.find((p) => p.id_producto === id_producto)?.stock || 0;
            alert(
                `No es posible pedir ${nuevaCantidad} unidades. El stock máximo es ${productStock}.`
            );
            return; // Detener la ejecución si no hay stock
        }

        try {
            // ... (Tu código actual para actualizar la cantidad en la API)
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/carts/update-item`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_carrito: parseInt(cart.id_carrito),
                        id_cartxitem: parseInt(id_cartxitem),
                        cantidad: nuevaCantidad,
                    }),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar cantidad");

            setCart((prev) => ({
                ...prev,
                items: prev.items.map((item) =>
                    item.id_cartxitem === id_cartxitem
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                ),
            }));
        } catch (err) {
            console.error("Error actualizando cantidad:", err);
        }
    };

    //decrementar cantidad del item en el carrito
    const decrementarCantidad = (id_cartxitem) => {
        const item = cart.items.find((el) => el.id_cartxitem === id_cartxitem);
        if (item && item.cantidad > 1) {
            updateCantidad(id_cartxitem, item.cantidad - 1);
        }
    };
    //eliminar item del carrito
    const removeFromCart = async (id_cartxitem) => {
        if (!cart.id_carrito) return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/carts/delete-item`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_carrito: parseInt(cart.id_carrito),
                        id_cartxitem: parseInt(id_cartxitem),
                    }),
                }
            );

            if (!res.ok) throw new Error("Error al eliminar item");

            setCart((prev) => ({
                ...prev,
                items: prev.items.filter(
                    (item) => item.id_cartxitem !== id_cartxitem
                ),
            }));
        } catch (err) {
            console.error("Error eliminando item:", err);
        }
    };
    const total =
        cart.items?.reduce(
            (acc, el) => acc + (el.precio || 0) * (el.cantidad || 0),
            0
        ) || 0;

    const total_cant = cart.items?.reduce((acc, item) => {
        return acc + item.cantidad;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                isLoadingCart,
                isErrorCart,
                total,
                total_cant,
                addItemToCart,
                decrementarCantidad,
                removeFromCart,
            }}>
            {children}
        </CartContext.Provider>
    );
}
