import { TbMinus, TbPlus, TbX } from "react-icons/tb";
export default function Item({ item, addItemToCart, decrementarCantidad,removeFromCart }) {
    //console.log("ITem: ", item); // cantidad, id_carrito, id_cartxitem, id_producto
 
	const handleRemove=(e)=>{
		e.stopPropagation()
		removeFromCart(item.id_cartxitem)
	}
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-300 py-3 px-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            {/* Info del producto */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                    <img
                        className="w-full h-full object-cover"
                        src={item.image}
                        alt={item.nombre}
                        onError={(e) => (e.target.src = "/not-found.png")}
                    />
                </div>
                <div className="font-medium text-gray-800 truncate">
                    {/* nombre del producto */} {item.nombre}
                </div>
                <div className="font-medium text-gray-800 truncate">
                    {/* color del producto  */} {item.color}
                </div>
                <div className="font-medium text-gray-800 truncate">
                    {/* talle del producto  */} {item.talle}
                </div>
            </div>

            {/* Precio unidad */}
            <div className="text-gray-700 font-semibold sm:w-24 text-center">
                Precio: ${item.precio}
            </div>

            {/* Cantidad */}
            <div className="flex items-center justify-center gap-2 sm:w-28">
                <button className="cursor-pointer p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition" onClick={()=>decrementarCantidad(item.id_cartxitem)}>
                    <TbMinus />
                </button>
                <span className="w-8 text-center font-medium text-gray-800">
                    {item.cantidad}
                </span>
                <button className="cursor-pointer p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition" onClick={()=>addItemToCart(item)}>
                    <TbPlus />
                </button>
            </div>

            {/* Total */}
            <div className="text-gray-800 font-semibold sm:w-24 text-center">
                ${item.cantidad* item.precio}
            </div>

            {/* Eliminar */}
            <button className="cursor-pointer p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition self-center sm:self-auto" onClick={handleRemove}>
                <TbX />
            </button>
        </div>
    );
}
