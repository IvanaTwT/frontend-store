// src/components/products/ProductEdit.jsx
import useFetch from "../../hooks/useFetch";
import ThemeContext from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductContext } from "../../contexts/ProductContext";

export default function ProductEdit({ product, onClose }) {
  const { token,user_id } = useAuth("state");
  const { theme } = useContext(ThemeContext);
  const { updateProduct} = useContext(ProductContext)
  const colors =
    theme === "light"
      ? "bg-slate-100 text-gray-900"
      : "bg-slate-700 text-white";

  const [{ data: dataUpdate, isError: isErrorUpdate, isLoading: isLoadingUpdate }, doFetchProductUpdate] = useFetch(
    `${import.meta.env.VITE_BACKEND_URL}/products/update-product`,
    {
      method: "PUT",
      headers: {  "Content-Type": "application/json" , Authorization: `Token ${token}` },
    }
  );
  // console.log("EDIT: ",product)
  const [formData, setFormData] = useState({
    user_id: parseInt(user_id),
    id_categoria: product.id_categoria,
    nombre: product.nombre,
    talle: product.talle,
    color: product.color,
    categoria_edad: product.categoria_edad,
    id_producto: product.id_producto,
    path_image: product.path_image || "",
    precio: product.precio || 0,
    stock: product.stock || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Product Update: ",formData)
    setFormData({
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
    });

    doFetchProductUpdate({
      body: JSON.stringify(formData),
    });
  };

  useEffect(() => {
    if (dataUpdate && !isLoadingUpdate) {
      if (dataUpdate.error) {
        toast.error(dataUpdate.error);
      } else {
        toast.success("Producto actualizado correctamente");
        updateProduct(formData)
        onClose(); // Cierra el modal
      }
    }
  }, [dataUpdate, isLoadingUpdate, isErrorUpdate]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full p-4 rounded-2xl space-y-4 ${colors}`}
    >
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Editar Producto #{formData.id_producto}
      </h2>

      <div>
        <label className="block mb-1 font-medium">Precio</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Imagen (URL)</label>
        <input
          type="text"
          name="path_image"
          value={formData.path_image}
          onChange={handleChange}
          placeholder="Ej: https://ejemplo.com/imagen.jpg"
          className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
      >
        {!isLoadingUpdate ? "Actualizando..." : "Guardar Cambios"}
      </button>
    </form>
  );
}
