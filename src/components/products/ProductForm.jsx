import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import useFetch from "../../hooks/useFetch";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ProductContext } from "../../contexts/ProductContext";

export default function ProductForm() {
    const { token, user_id } = useAuth("state");
    const { theme } = useContext(ThemeContext);
    const { addProduct } = useContext(ProductContext);
    const navigate = useNavigate();

    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const categoria_edad = ["Hombre", "Mujer", "Niño"];

    const [categories, setCategories] = useState([]);
    const [selectTalle, setSelectTalle] = useState([
        "XXS", "XS", "S", "M", "L", "XL", "XXL"
    ]);

    const selectColors = [
        "Negro", "Blanco", "Rosa", "Azul Marino", "Celeste", "Beige"
    ];

    // fetch categorías
    const [
        { data: dataCategory, isError: isErrorCategory, isLoading: isLoadingCategory },
        doFetchCategory,
    ] = useFetch(`${import.meta.env.VITE_API_BASE_URL}/products/categories`, {
        method: "GET",
    });

    // fetch crear producto
    const [
        { data: dataProduct, isError: isErrorProduct, isLoading: isLoadingProduct },
        doFetchProduct,
    ] = useFetch(`${import.meta.env.VITE_API_BASE_URL}/products/new-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    useEffect(() => {
        doFetchCategory();
    }, []);

    useEffect(() => {
        if (dataCategory && !isLoadingCategory && !isErrorCategory) {
            if (dataCategory.message) {
                setCategories(dataCategory.message);
            } else if (dataCategory.error) {
                toast.error(dataCategory.error, {
                    position: "bottom-right",
                    duration: 4000,
                });
            }
        }
    }, [dataCategory, isLoadingCategory, isErrorCategory]);

    const [formData, setFormData] = useState({
        user_id: parseInt(user_id),
        id_categoria: 0,
        path_image: "",
        color: "",
        precio: 0,
        stock: "",
        talle: "",
        categoria_edad: "",
    });

    // cambia los talles según la prenda elegida
    useEffect(() => {
        if (!formData.id_categoria) return;

        const selectedCat = categories.find(
            (cat) => cat.id_categoria === parseInt(formData.id_categoria)
        );

        if (selectedCat) {
            const nombre = selectedCat.nombre.toLowerCase();

            const esNumerico = [
                "zapatilla", "zapato", "pantalon", "jeans", "jeans cargo", "medias", "media"
            ].some((word) => nombre.includes(word));

            if (esNumerico) {
                setSelectTalle(["4", "6", "8", "10", "36", "38", "40", "42", "44", "46", "48", "50"]);
            } else {
                setSelectTalle(["XXS", "XS", "S", "M", "L", "XL", "XXL"]);
            }

            // limpiar talle si cambió el tipo de prenda
            setFormData((prev) => ({
                ...prev,
                talle: "",
            }));
        }
    }, [formData.id_categoria, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.id_categoria ||
            !formData.color ||
            !formData.categoria_edad ||
            !formData.talle ||
            !formData.stock ||
            !formData.precio ||
            !formData.path_image
        ) {
            toast.error("Completa todos los campos obligatorios");
            return;
        }

        const formUP = {
            ...formData,
            id_categoria: parseInt(formData.id_categoria),
            precio: parseInt(formData.precio),
            stock: parseInt(formData.stock),
        };

        // console.log("FORM POST PRODUCT: ", formUP);
        doFetchProduct({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(formUP),
        });
    };

    useEffect(() => {
        if (dataProduct && !isLoadingProduct) {
            if (dataProduct.error) {
                toast.error(dataProduct.error);
            } else {
                toast.success("Producto creado correctamente");

                // buscar la categoría seleccionada para incluir su nombre
                const selectedCat = categories.find(
                    (cat) => cat.id_categoria === parseInt(formData.id_categoria)
                );

                const formUP = {
                    ...formData,
                    id_producto: parseInt(dataProduct.id_producto),
                    id_categoria: {
                        id_categoria: parseInt(formData.id_categoria),
                        nombre: selectedCat ? selectedCat.nombre : "", 
                    },
                    precio: parseInt(formData.precio),
                    stock: parseInt(formData.stock),
                };

                // console.log("PRODUCT ADD CONTEXT: ", formUP);
                addProduct(formUP);

                setFormData({
                    user_id: parseInt(user_id),
                    id_categoria: 0,
                    path_image: "",
                    color: "",
                    precio: 0,
                    stock: 0,
                    talle: "",
                    categoria_edad: "",
                });
            }
        }
    }, [dataProduct, isLoadingProduct]);

    return (
        <div className={`min-h-screen flex justify-center items-center ${colors}`}>
            <form
                onSubmit={handleSubmit}
                className={`w-full max-w-lg p-6 rounded-2xl shadow-lg space-y-4 ${colors}`}>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Formulario de Producto
                </h2>

                {/* Categoría por edad */}
                <div>
                    <label className="block mb-1 font-medium">Categoría por edad</label>
                    <select
                        name="categoria_edad"
                        value={formData.categoria_edad}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${colors}`}>
                        <option value="">Seleccionar</option>
                        {categoria_edad.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* Categoría (desde API) */}
                <div>
                    <label className="block mb-1 font-medium">Prenda</label>
                    <select
                        name="id_categoria"
                        value={formData.id_categoria}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${colors}`}>
                        <option value="">Seleccionar</option>
                        {categories.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div>
                    <label className="block mb-1 font-medium">Color</label>
                    <select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${colors}`}>
                        <option value="">Seleccionar</option>
                        {selectColors.map((color) => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>

                {/* Precio y Stock */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block mb-1 font-medium">Precio</label>
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            required
                            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Talle dinámico */}
                <div>
                    <label className="block mb-1 font-medium">Talle</label>
                    <select
                        name="talle"
                        value={formData.talle}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${colors}`}>
                        <option value="">Seleccionar</option>
                        {selectTalle.map((talle) => (
                            <option key={talle} value={talle}>{talle}</option>
                        ))}
                    </select>
                </div>

                {/* Imagen */}
                <div>
                    <label className="block mb-1 font-medium">Imagen (URL)</label>
                    <input
                        type="text"
                        required
                        name="path_image"
                        value={formData.path_image}
                        onChange={handleChange}
                        placeholder="Ej: https://ejemplo.com/imagen.jpg"
                        className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                    Guardar Producto
                </button>
            </form>
        </div>
    );
}
