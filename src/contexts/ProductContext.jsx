import { createContext, useReducer, useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const ProductContext = createContext();

export default function ProductProvider({ children }) {
    const [ products, setProducts]= useState([]);
    const [categories, setCategories] = useState([]);
    const [valoraciones, setValoraciones] = useState([]);
    const [ isLoadingValoracion, setIsLoadingValoracion]= useState(true);
    const [isErrorValoracion, setIsErrorValoracion]= useState(false)
    const [isLoadingProducts, setIsLoadingProducts] = useState(true); // Estado de carga
    const [isErrorProducts, setIsErrorProducts] = useState(false); // Estado de error
    const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Estado de carga para categorias
    const [isErrorCategories, setIsErrorCategories] = useState(false); // Estado de error para categorias

    const [{ data, isError, isLoading }, doFetchProducts] = useFetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/all`,
        {
            method: "GET",
        }
    );

    //todas las categorias del producto
    const [
        {
            data: dataCategory,
            isError: isErrorCategory,
            isLoading: isLoadingCategory,
        },
        doFetchCategory,
    ] = useFetch(`${import.meta.env.VITE_BACKEND_URL}/products/categories`, {
        method: "GET",
    });

    //todas las categorias del producto
    const [
        {
            data: dataValo,
            isError: isErrorValo,
            isLoading: isLoadingValo,
        },
        doFetchValo,
    ] = useFetch(`${import.meta.env.VITE_BACKEND_URL}/valoracion/`, {
        method: "GET",
    });

    //productos y categorias
    useEffect(() => {
        setIsLoadingProducts(true);
        doFetchProducts();
        doFetchCategory();
        doFetchValo()
    }, []);

    useEffect(() => {
        // console.log("Entrando a products");
        if (data && !isLoading && !isError) {
            // console.log("Respuesta backend:", data);
            if (data.message) {
                setProducts(data.message);
                setIsLoadingProducts(false);
            } else if (data.error) {
                setIsErrorProducts(true);
            }
        }
    }, [data, isLoading, isError]);

    useEffect(() => {
        if (dataCategory && !isLoadingCategory && !isErrorCategory) {
            if (dataCategory.message) {
                // console.log("CATEGORIES:", dataCategory.message);
                setCategories(dataCategory.message);
                setIsLoadingCategories(false);
            } else if (dataCategory.error) {
                setIsErrorCategories(true);
            }
        }
    }, [dataCategory, isLoadingCategory, isErrorCategory]);

    useEffect(() => {
        if (dataValo && !isLoadingValo && !isErrorValo) {
            if (dataValo.message) {
                setValoraciones(dataValo.message);
                setIsLoadingValoracion(false);
            } else if (dataValo.error) {
                setIsErrorValoracion(true);
            }
        }
    }, [dataValo, isLoadingValo, isErrorValo]);

     //  Agregar producto al array products
    const addProduct = (newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
    };

    // Actualizar un producto existente, pasar el objeto
    const updateProduct = (updatedProduct) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id_producto === updatedProduct.id_producto ? updatedProduct : p
            )
        );
    };

    //  Eliminar producto por id_producto
    const deleteProduct = (id_producto) => {
        setProducts((prev) =>
            prev.filter((p) => p.id_producto !== id_producto)
        );
    };


    //  Agregar valoracion/comentario al array valoraciones
    const addValoracion = (newValoracion) => {
        setValoraciones((prev) => [...prev, newValoracion]);
    };

    // Actualizar un producto existente, pasar el objeto
    const updateValoracion = (updatedValoracion) => {
        setValoraciones((prev) =>
            prev.map((v) =>
                v.id_valoracion === updatedValoracion.id_valoracion ? updatedValoracion : v
            )
        );
    };

    //  Eliminar producto por id_valoracion
    const deleteValoracion = (id_valoracion) => {
        setValoraciones((prev) =>
            prev.filter((v) => v.id_valoracion !== id_valoracion)
        );
    };

    // Verifica si hay stock suficiente antes de añadir al carrito
    const verifyStock = (id_producto, cantidad) => {
        const producto = products.find((p) => p.id_producto === id_producto);
        if (!producto) return false;
        return producto.stock >= cantidad;
    };

    //  Disminuye el stock localmente (por ejemplo, al confirmar pedido)
    const disminuirStock = (id_producto, cantidad) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id_producto === id_producto
                    ? { ...p, stock: Math.max(0, p.stock - cantidad) }
                    : p
            )
        );
    };

    return(
        <ProductContext.Provider value={{products, verifyStock, disminuirStock,categories, valoraciones, isLoadingProducts, isErrorProducts, isLoadingCategories, isErrorCategories, addProduct, updateProduct, deleteProduct, addValoracion, updateValoracion, deleteValoracion, isLoadingValoracion, isErrorValoracion}}>
            {children}
        </ProductContext.Provider>
    )
}