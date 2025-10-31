import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import useFetch from "../../hooks/useFetch";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Signup() {
    const { theme } = useContext(ThemeContext);
    const navigate= useNavigate()
    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [formData, setFormData] = useState({
        username:"",
        nombre_completo: "",
        email: "",
        password: "",
        n_celular:""
    });

    const [{ data, isError, isLoading }, doFetch] = useFetch(
            `${import.meta.env.VITE_API_BASE_URL}/new_user/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }
        );

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "n_celular") {
            // Solo números
            const regex = /^[0-9]*$/;
            if (!regex.test(value)) return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, nombre_completo, email, password, n_celular } = formData;
        if (!/^[0-9]{10}$/.test(n_celular)) {
            toast.error("El número de celular debe tener exactamente 10 dígitos.");
            return;
        }
        // console.log("Datos enviados:", formData);
        doFetch({
            body: JSON.stringify(formData),
        });
        
    };
    useEffect(()=>{
        if (data && !isLoading && !isError){
            if(data.message){
                toast.success(data.message, {
                    position: "bottom-right",
                    duration: 4000,
                })
                navigate("/login");
            }else{
                toast.error(data.error, {
                    position: "bottom-right",
                    duration: 4000,
                })
            }
        }
    },[data, isLoading, isError])
    return (
        <div className={`flex justify-center items-center min-h-screen p-4 ${colors}`}>
            <form
                onSubmit={handleSubmit}
                className={ `w-full max-w-md shadow-lg rounded-2xl p-8 space-y-6 border ${colors}`}>
                <h2 className={`text-2xl font-bold text-center pr-4 ${colors}`}>
                    Perfil
                </h2>
                {/* Nombre de usuario*/}
                <div>
                    <label className={`block mb-1 ${colors}`}>
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Ingresa tu nombre de usuario"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                        required
                    />
                </div>

                {/* Nombre Completo*/}
                <div>
                    <label className={`block  mb-1 ${colors}`}>
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        name="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={handleChange}
                        placeholder="Ingresa tu nombre completo"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className={`block mb-1 ${colors}`}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                        required
                    />
                </div>

                {/* Número de celular */}
                <div>
                    <label className={`block  mb-1 ${colors}`}>
                        Numero Celular
                    </label>
                    <input
                        type="text"
                        name="n_celular"
                        value={formData.n_celular}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="387XXXXXXX"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                        required
                    />
                </div>
                {/* Password */}
                <div>
                    <label className={`block mb-1 ${colors}`}>
                        Contraseña
                    </label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        type="password"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${colors}`}
                        required
                    />
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
                    Enviar
                </button>
            </form>
        </div>
    );
}
