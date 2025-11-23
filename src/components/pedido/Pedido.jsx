import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
export default function Pedido({ pedido, onEdit, onDelete }) {
    const navigate = useNavigate();
    const { is_admin } = useAuth("state");
 
    if(is_admin===0 && window.location.pathname==="/admin-dashboard"){
        console.alert("No tiene permisos para acceder a esta ruta")
        navigate("/")
    }

    return (
        <li className="flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow-md p-4 mb-3 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-700 flex flex-wrap items-center">
                <span className="font-semibold text-gray-800">
                    <i className="fa-solid fa-receipt text-gray-600 mr-1"></i>{" "}
                    Pedido #{pedido.id_pedido}
                </span>
                {pedido?.items && 
                (
                    <span>
                    <i className="fa-solid fa-box text-gray-600 mr-1"></i>{" "}
                    {pedido.items.length} productos
                </span>
                )
                }
                <span>
                    <i className="fa-solid fa-dollar-sign text-green-600 mr-1"></i>{" "}
                    Total:{" "}
                    <span className="font-bold text-green-600">
                        ${pedido.total}
                    </span>
                </span>
                <span>
                    <i className="fa-solid fa-info-circle text-blue-500 mr-1"></i>{" "}
                    Estado:{" "}
                    <span className="font-semibold text-blue-500">
                        {pedido.estado}
                    </span>
                </span>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
                onClick={() => navigate(`/pedido/${pedido.id_pedido}`)}
                className="cursor-pointer p-2 bg-lime-500 hover:bg-lime-600 text-black rounded-lg shadow-sm transition flex items-center justify-center">
                <i className="fa-solid fa-eye"></i>
            </button>
            {is_admin && window.location.pathname==="/admin-dashboard"
            ? (<button
                onClick={onEdit}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-black p-2 rounded-lg shadow-sm transition flex items-center justify-center">
                <i className="fa-regular fa-pen-to-square"></i>
            </button>
            )
            : null
            }
            {/* {is_admin && window.location.pathname==="/admin-dashboard"
            ? (
                <button
                onClick={onDelete}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-black p-2 rounded-lg shadow-sm transition flex items-center justify-center">
                <i class="fa-solid fa-trash"></i>
            </button>
            ): null
            } */}
            </div>
        </li>
    );
}
