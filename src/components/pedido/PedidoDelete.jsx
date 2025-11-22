// src/components/products/ProductEdit.jsx
import useFetch from "../../hooks/useFetch";
import ThemeContext from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PedidoDelete({ pedido, onClose }) {
  const { token,user_id } = useAuth("state");
  const { theme } = useContext(ThemeContext);
  const colors =
    theme === "light"
      ? "bg-slate-100 text-gray-900"
      : "bg-slate-700 text-white";

  const [{ data: dataDelete, isError: isErrorDelete, isLoading: isLoadingDelete }, doFetchDelete] = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/pedidos/delete`,
    {
      method: "DELETE",
      headers: {  "Content-Type": "application/json" , Authorization: `Token ${token}` },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    doFetchDelete({
      body: JSON.stringify({
        user_id: parseInt(user_id),
        id_pedido: parseInt(pedido.id_pedido),
      }),
    });
  };

  useEffect(() => {
    if (dataDelete && !isLoadingDelete) {
      if (dataDelete.error) {
        toast.error(dataDelete.error);
      } else {
        toast.success("Pedido eliminado correctamente");
        onClose(); // Cierra el modal
      }
    }
  }, [dataDelete, isLoadingDelete, isErrorDelete]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full p-4 rounded-2xl space-y-4 ${colors}`}
    >
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Eliminar Pedido #{pedido.id_pedido}
      </h2>
        <p className="text-center">¿Estás seguro que deseas eliminar este pedido?</p>
        <p className="text-center text-red-500 font-medium">Esta acción no se puede deshacer.</p>
      <button
        type="submit"
        className="w-full  bg-red-500 hover:bg-red-600 text-black py-2 rounded-lg transition font-medium"
      >
        {!isLoadingDelete? "Eliminando..." : "Eliminar"}
      </button>
    </form>
  );
}
