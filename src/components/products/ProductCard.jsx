import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext"; // ajustá la ruta según dónde esté tu contexto
import { TbShoppingCartPlus } from "react-icons/tb";
import ThemeContext from "../../contexts/ThemeContext"
export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addItemToCart } = useContext(CartContext);
    const { theme } = useContext(ThemeContext);
    
        const colors =
            theme === "light"
                ? "bg-slate-100 text-gray-900"
                : "bg-slate-700 text-white";
    const dict_category = product.id_categoria;

    const handleAddToCart = (e) => {
        e.stopPropagation(); // evita navegar al hacer clic en el botón
        addItemToCart(product);
    };

    return (
        <div
            className={`${colors} group relative rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer `}
            onClick={() => navigate(`/products/${product.id_producto}`)}
        >
            <img
                src={
                    product.path_image && product.path_image !== "-"
                        ? product.path_image
                        : "https://via.placeholder.com/300x300?text=No+Image"
                }
                alt={dict_category.nombre}
                className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75 transition-all duration-300"
            />

            <div className="mt-4 flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-semibold ">
                        {dict_category.nombre}
                    </h3>
                    <p className="mt-1 text-xs  capitalize">
                        {product.color}
                    </p>
                    <p className="mt-1 text-xs  capitalize">
                        talle: {product.talle}
                    </p>
                </div>
                <p className="text-sm font-medium ">
                    ${product.precio}
                </p>
                
            </div>

            <button
                onClick={handleAddToCart}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors duration-200"
            >
                <TbShoppingCartPlus className="text-lg" />
                Añadir al carrito
            </button>
        </div>
    );
}
