import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import Valoracion from "./Valoracion"
import ValoracionForm from "./ValoracionForm";
import ThemeContext from "../../contexts/ThemeContext";
export default function VerValoraciones({ id_producto }) {
    const {
        valoraciones,
        addValoracion,
        updateValoracion,
        deleteValoracion,
        isLoadingValoracion,
        isErrorValoracion,
    } = useContext(ProductContext);

    const [valoracionesProducto, setValoracionesProducto] = useState([]);
    const { theme } = useContext(ThemeContext);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";
    useEffect(() => {
        if (valoraciones && id_producto) {
            const filtradas = valoraciones.filter(
                (v) => parseInt(v.id_producto) === parseInt(id_producto)
            );
            setValoracionesProducto(filtradas);
            // console.log("filter ",filtradas)
        }
    }, [valoraciones, id_producto]); 

    if (isLoadingValoracion)return (<div className="p-4 text-gray-500 italic">Cargando comentarios...</div>);
    if (isErrorValoracion) return (<div className="p-4 text-red-600 font-medium">Error al cargar comentarios acerca de este producto.</div>);
    

    return (
        <section className={`max-w-3xl mx-auto p-6 rounded-lg m-6 ${colors} rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)]`}>
            <h3 className={`text-xl font-semibold mb-4 border-b pb-2 `}>
                Valoraciones
            </h3>

            {/* Si hay valoraciones */}
            {valoracionesProducto.length > 0 ? (
                <ul className={`space-y-4 ${colors}`}>
                    {valoracionesProducto.map((v) => (
                        
                            <Valoracion
                            key={v.id_valoracion}
                                valoracion={v}
                                updateValoracion={updateValoracion}
                                deleteValoracion={deleteValoracion}
                            />
                    ))}
                </ul>
            ) : (
                <p className={` italic mb-4 ${colors}`}>
                    Aún no hay valoraciones para este producto.
                </p>
            )}

            {/* Formulario para agregar una nueva */}
            <div className={`mt-6 ${colors}`}>
                <h4 className="text-lg font-medium mb-2 ">
                    Realiza un comentario
                </h4>
                <ValoracionForm addValoracion={addValoracion} />
            </div>
        </section>
    );
}
