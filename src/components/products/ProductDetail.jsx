import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import ThemeContext from "../../contexts/ThemeContext";
import { ProductContext } from "../../contexts/ProductContext";
import { CartContext } from "../../contexts/CartContext";
import { TbShoppingCartPlus } from "react-icons/tb";
import VerValoraciones from "../valoracion/VerValoraciones";
export default function ProductDetail() {
    const { id } = useParams();
    const { products, isLoadingProducts, isErrorProducts } =
        useContext(ProductContext);
    const { theme } = useContext(ThemeContext);
    const { addItemToCart } = useContext(CartContext);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!isLoadingProducts && products.length > 0 && !isErrorProducts) {
            products.map((p) => {
                if (p.id_producto === parseInt(id)) {
                    setProduct(p);
                }
            });
        }
    }, [products]);

    if (isLoadingProducts)
        return (
            <p className="text-center mt-10 text-gray-500">
                Cargando producto...
            </p>
        );
    if (isErrorProducts)
        return (
            <p className="text-center text-red-500 mt-10">
                Error al cargar el producto.
            </p>
        );
    if (!product) return null;

    // Colores visuales para los inputs
    const colorMap = {
        Negro: "bg-black",
        Blanco: "bg-white border",
        Rosa: "bg-pink-400",
        "Azul Marino": "bg-sky-900",
        Celeste: "bg-sky-500",
        Beige: "bg-yellow-100",
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addItemToCart(product);
    };
    return (
        <div className={`flex justify-center items-center min-h-screen  p-4  ${colors} `}>
            <div className={`max-w-4xl mx-auto p-6 min-h-screen w-full`}>
                <div
                    className={`max-w-3xl mx-auto p-6 shadow rounded-lg m-6 ${colors} shadow-[0_4px_30px_rgba(0,0,0,0.5)]`}>
                    {/*detalle del producto */}
                    <div className="flex flex-col md:flex-row gap-6 ">
                        <div className="flex-1 flex justify-center items-center">
                            <img
                                src={
                                    product.path_image &&
                                    product.path_image.trim() !== ""
                                        ? product.path_image
                                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                }
                                alt={
                                    product.id_categoria?.nombre ||
                                    "Producto sin nombre"
                                }
                                className="w-full max-w-sm h-[400px] object-cover rounded-lg shadow-lg border border-gray-200"
                            />
                        </div>

                        <div
                            className={`flex-1 flex flex-col justify-center ${colors}`}>
                            <h2 className="text-2xl font-bold mb-2">
                                {product.id_categoria?.nombre
                                    ? product.id_categoria.nombre
                                          .charAt(0)
                                          .toUpperCase() +
                                      product.id_categoria.nombre.slice(1)
                                    : "Producto"}
                            </h2>

                            <p className="mb-1">
                                Categoría: {product.categoria_edad}
                            </p>
                            <p className="mb-1">Talle: {product?.talle}</p>

                            <div className="flex items-center gap-x-3 mb-2">
                                <p>Color:</p>
                                <div className="flex rounded-full outline -outline-offset-1 outline-black/10">
                                    <input
                                        type="radio"
                                        name="color"
                                        value={product.color}
                                        checked
                                        readOnly
                                        aria-label={product.color}
                                        className={`size-8 appearance-none rounded-full forced-color-adjust-none 
                                        checked:outline-2 checked:outline-offset-2 checked:outline-gray-400 
                                        focus-visible:outline-3 focus-visible:outline-offset-3 
                                        ${
                                            colorMap[product.color] ||
                                            "bg-gray-300"
                                        }`}
                                    />
                                </div>
                                <span>{product.color}</span>
                            </div>

                            <p className="font-semibold text-lg mt-2">
                                ${product.precio}
                            </p>
                            <p className="text-sm mb-3">
                                Stock: {product.stock}
                            </p>

                            <button
                                onClick={handleAddToCart}
                                className="cursor-pointer mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors duration-200">
                                <TbShoppingCartPlus className="text-lg" />
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
                {/* Valoraciones */}

                <VerValoraciones id_producto={product.id_producto} />
            </div>
        </div>
    );
}
