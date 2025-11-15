import ProductCard from "./ProductCard";
import Products from "./Products";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../contexts/ThemeContext"
import { ProductContext } from "../../contexts/ProductContext";
import Container from "../Container"
export default function ProductList() {
    const { products, categories, isLoadingProducts, isErrorProducts, isLoadingCategories, isErrorCategories } = useContext(ProductContext);
    const category_edad = ["Hombre", "Mujer", "Niño"];
    const navigate = useNavigate();
    //tema-color-pagina
    const { theme } = useContext(ThemeContext);

    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [selectedPrenda, setSelectedPrenda] = useState(null);//seleciona la categoria de prenda
    const [selectedEdad, setSelectedEdad] = useState(null);//selecciona para que edad
    const [filteredProducts, setFilteredProducts] = useState([]);//se filtra los productos a mostrar
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        // console.log("Entrando a products");
        if (isLoadingProducts && isErrorProducts) {
            toast.error(data.error, {
                    position: "bottom-right",
                    duration: 4000,
                });
        }
    }, [isLoadingProducts, isErrorProducts]);

    useEffect(() => {
        if (isLoadingCategories && isErrorCategories) {
            toast.error(dataCategory.error, {
                    position: "bottom-right",
                    duration: 4000,
                });
            }
        
    }, [isLoadingCategories, isErrorCategories]);

    useEffect(() => {
        if (!products) return;

        let result = products;

        if (selectedPrenda) {
            result = result.filter((p) => p.id_categoria?.id_categoria === selectedPrenda);
        }
        // console.log("result filtro: ",result)
        if (selectedEdad) {
            result = result.filter((p) => p.categoria_edad === selectedEdad);
        }

        setFilteredProducts(result);
        // console.log("productos flitrados: ",filteredProducts)
    }, [products, selectedPrenda, selectedEdad]);

    if (isLoadingProducts || isLoadingCategories) return (<Container><p>Cargando...</p></Container>);
    if (isErrorProducts || isErrorCategories)
        return (<Container><p>Error al cargar productos/categorías.</p></Container>);
    if (products.length <= 0) return (<Container><p>No hay productos disponibles</p></Container>);

    return (
        <div className={`flex flex-col h-screen p-1  ${colors} shadow-[0px_3px_3px_rgba(0,0,0,0.5)]`}>
            {/* Fila superior: categorías de edad */}
            <div className={`flex gap-4 ${colors} m-1 p-2 shadow-[0px_3px_3px_rgba(0,0,0,0.5)]`} >
                {category_edad.map((edad) => (
                    <div
                        key={edad}
                        className={`grid w-full grid-cols-${category_edad.length} ${colors} `}>
                        <button
                            
                            onClick={() => setSelectedEdad(edad)}
                            className={`px-4 py-3 text-center font-medium border transition ${
                                selectedEdad === edad
                                    ? `${theme === "light"? "bg-teal-500 text-black" : "bg-gray-400  text-white" }`
                                    : `${theme === "light" ? " hover:bg-gray-300 text-black" : "hover:bg-gray-300 text-white" }`
                            }`}>
                            {edad}
                        </button>
                    </div>
                ))}
            </div>

            {/* Fila 2: sidebar + productos */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar izquierda: categorías de prenda (PC)*/}
                <aside className={`hidden md:block w-1/5 m-1 p-2 overflow-y-auto shadow-[0px_3px_3px_rgba(0,0,0,0.5)] ${colors}`}>
                    <ul className="space-y-2">
                        {categories?.length > 0 ? (
                            categories.map((cat) => (
                                <li
                                    key={cat.id_categoria}
                                    className={`text-center cursor-pointer px-3 py-2 rounded-md ${
                                        selectedPrenda === cat.id_categoria
                                            ? theme === "light"
                                                ? "bg-teal-500 text-black"
                                                : "bg-gray-400 text-white"
                                            : theme === "light"
                                            ? "hover:bg-gray-300 text-black"
                                            : "hover:bg-gray-300 text-white"
                                    }`}
                                    onClick={() => setSelectedPrenda(cat.id_categoria)}>
                                    {cat.nombre}
                                </li>
                            ))
                        ) : (
                            <li>No hay categorías</li>
                        )}
                    </ul>
                </aside>

                {/* BOTÓN BURGER MOBILE */}
                <div className="md:hidden absolute top-75 left-4 z-20">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 bg-gray-800 text-white rounded">
                        {menuOpen ? (
                            <i className="fa-solid fa-xmark text-xl"></i>
                        ) : (
                            <i className="fa-solid fa-bars text-xl"></i>
                        )}
                    </button>
                </div>

                {/* MENU MOBILE DESPLEGABLE */}
                {menuOpen && (
                    <div
                        className={`md:hidden fixed top-0 left-0 w-2/3 h-full p-2 shadow-lg z-30 ${colors}`}>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-2 right-4 p-2 bg-gray-800 text-white rounded"
                        >
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Categorías</h3>
                        <ul className="space-y-2">
                            {categories?.length > 0 ? (
                                categories.map((cat) => (
                                    <li
                                        key={cat.id_categoria}
                                        className={`cursor-pointer px-3 py-2 rounded-md ${
                                            selectedPrenda === cat.id_categoria
                                                ? theme === "light"
                                                    ? "bg-teal-500 text-black"
                                                    : "bg-gray-400 text-white"
                                                : theme === "light"
                                                ? "hover:bg-gray-300 text-black"
                                                : "hover:bg-gray-300 text-white"
                                        }`}
                                        onClick={() => {
                                            setSelectedPrenda(cat.id_categoria);
                                            setMenuOpen(false);
                                        }}>
                                        {cat.nombre}
                                    </li>
                                ))
                            ) : (
                                <li>No hay categorías</li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Contenedor de productos scrollable */}
                <main className={`flex-1 overflow-y-auto p-4 ${colors}`}>
                    {filteredProducts.length > 0 ? (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id_producto}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 mt-10">
                            No hay productos para esta categoría
                        </p>
                    )}
                </main>
            </div>
        </div>
    );
}
