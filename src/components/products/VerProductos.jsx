import { useState, useContext, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import ThemeContext from "../../contexts/ThemeContext";
import Producto from "./Producto";
import Modal from "../../components/Modal";
import ProductEdit from "./ProductEdit";
import ProductDelete from "./ProductDelete";
import { ProductContext } from "../../contexts/ProductContext";
import Container from "../Container";
export default function VerProductos() {
    const { products, isLoadingProducts, isErrorProducts } =
        useContext(ProductContext);
    const [productsList, setProductsList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const { theme } = useContext(ThemeContext);
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    useEffect(() => {
        if (products && !isLoadingProducts && !isErrorProducts) {
            const prdts = products.map((p) => {
                const categoria = p.id_categoria;
                return {
                    id_categoria: parseInt(categoria.id_categoria),
                    id_producto: parseInt(p.id_producto),
                    nombre: categoria.nombre,
                    marca: categoria.marca,
                    descripcion: categoria.descripcion,
                    color: p.color,
                    precio: parseInt(p.precio),
                    stock: parseInt(p.stock),
                    talle: p.talle,
                    categoria_edad: p.categoria_edad,
                    path_image: p.path_image,
                };
            });
            setProductsList(prdts);
        }
    }, [products, isLoadingProducts, isErrorProducts]);

    return (
        <div className={`p-6 ${colors}`}>
            <ul className="space-y-4">
                {productsList.length > 0 ? (
                    productsList.map((p) => (
                        <Producto
                            key={p.id_producto}
                            product={p}
                            onEdit={() => {
                                setSelectedProduct(p);
                                setShowEdit(true);
                            }}
                            onDelete={() => {
                                setSelectedProduct(p);
                                setShowDelete(true);
                            }}
                        />
                    ))
                ) : (
                    <Container>
                        <p>No tienes productos aún</p>
                    </Container>
                )}
            </ul>

            <Modal isOpen={showEdit} onClose={() => setShowEdit(false)}>
                {selectedProduct && (
                    <ProductEdit
                        product={selectedProduct}
                        onClose={() => setShowEdit(false)}
                    />
                )}
            </Modal>

            <Modal isOpen={showDelete} onClose={() => setShowDelete(false)}>
                {selectedProduct && (
                    <ProductDelete
                        product={selectedProduct}
                        onClose={() => setShowDelete(false)}
                    />
                )}
            </Modal>
        </div>
    );
}