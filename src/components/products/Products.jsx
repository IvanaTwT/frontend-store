import ProductCard from "./ProductCard";
import { useEffect, useState, useContext } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import ThemeContext from "../../contexts/ThemeContext";
export default function Products() {
    const context = useContext(ProductContext);
    const {
        products = [],
        valoraciones = [],
        isLoadingProducts,
        isErrorProducts,
        isLoadingCategories,
        isErrorCategories,
    } = context || {};

    const [treStars, setTreStars] = useState([]);
    const { theme } = useContext(ThemeContext);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    useEffect(() => {
        if (products && valoraciones && valoraciones.length > 0) {
            const filtrados = products.filter((p) =>
                valoraciones.some(
                    (v) => v.id_producto === p.id_producto && v.estrellas >= 3
                )
            );
            setTreStars(filtrados);
        }
    }, [products, valoraciones]);

    if (isLoadingProducts || isLoadingCategories) return <p>Cargando...</p>;
    if (isErrorProducts || isErrorCategories) return <p>Error al cargar los productos.</p>;
    if (!products || products.length === 0) return <p>No hay productos disponibles</p>;
    if (treStars.length === 0) return <p>No hay productos con valoraciones altas</p>;
    
    return (
        <div className={`${colors} shadow-[0px_2px_2px_rgba(0,0,0,0.5)]`}>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Productos con más valoraciones:
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {treStars.map((producto) => (
                        <ProductCard
                            key={producto.id_producto}
                            product={producto}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
