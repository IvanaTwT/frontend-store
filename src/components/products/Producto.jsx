import { useNavigate } from "react-router-dom";
export default function Producto({ product}) {
    const navigate = useNavigate();
    return (
        <li className="flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow-md p-4 mb-3 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-700 flex flex-wrap items-center">
                <span className="font-semibold text-gray-800">
                    Producto #{product.id_producto}
                </span>
                {product.path_image?.length > 50 && (
                    <span>
                        <i className="fa-regular fa-image text-gray-500"></i>
                    </span>
                )}
                <span>{product.nombre}</span>
                {/* <span>{product.marca}</span> */}
                <span>{product.color}</span>
                <span>{product.talle}</span>
                <span>{product.categoria_edad}</span>
                {/* <span>{product.descripcion}</span> */}
                <span>
                    <i className="fa-solid fa-dollar-sign text-green-600 mr-1"></i>{" "}
                    <span className="font-bold text-green-600">
                        ${product.precio}
                    </span>
                </span>
                <span>
                    <i className="fa-solid fa-info-circle text-blue-500 mr-1"></i>{" "}
                    Stock:{" "}
                    <span className="font-semibold text-blue-500">
                        {product.stock}
                    </span>
                </span>
            </div>

            <div className="flex gap-2 mt-3 sm:mt-0">
                <button
                    onClick={() => navigate(`/products/${product.id_producto}`)}
                    className="cursor-pointer bg-lime-500 hover:bg-lime-600 text-black font-semibold px-4 py-2 rounded-lg transition">
                    <i className="fa-solid fa-eye"></i>
                </button>
                <button                    
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-black font-semibold px-4 py-2 rounded-lg transition">
                    <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button                    
                    className="cursor-pointer bg-red-500 hover:bg-red-600 text-black font-semibold px-4 py-2 rounded-lg transition">
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </li>
    );
}
