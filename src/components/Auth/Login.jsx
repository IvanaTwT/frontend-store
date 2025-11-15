import { useRef, useEffect, useContext, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ThemeContext from "../../contexts/ThemeContext";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth("actions");

    const { theme } = useContext(ThemeContext);

    const colors =
        theme === "light"
            ? "bg-slate-100 text-gray-900"
            : "bg-slate-700 text-white";

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }
    );

    const [
        {
            data: dataProfile,
            isError: isErrorProfile,
            isLoading: isLoadingProfile,
        },
        doFetchProfile,
    ] = useFetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
        method: "GET",
    });

    function handleSubmit(e) {
        e.preventDefault();
        doFetch({
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value,
            }),
        });
    }

    useEffect(() => {
        if (data?.error) {
            setMensaje(data.error);
        }

        if (data && !isError && !isLoading && data.token) {
            doFetchProfile({
                headers: { Authorization: `Token ${data.token}` },
            });
        }
    }, [data, isError, isLoading]);
    useEffect(() => {
        if (dataProfile && !isErrorProfile && !isLoadingProfile) {
            if (dataProfile.admin) {
                toast.success("Bienvenido " + dataProfile.username, {
                    position: "bottom-right",
                    duration: 4000,
                });
                login(data.token, dataProfile.user_id, null, dataProfile.admin);
                navigate("/");
            } else {
                // console.log("cliente: ",dataProfile)
                toast.success("Bienvenido " + dataProfile.user_id.username, {
                    position: "bottom-right",
                    duration: 4000,
                });
                login(
                    data.token,
                    dataProfile.user_id.user_id,
                    dataProfile.id_cliente,
                    dataProfile.user_id.admin
                );
                navigate("/");
            }
        }
    }, [data, dataProfile, isErrorProfile, isLoadingProfile]);

    return (
        <div
            className={`flex justify-center items-center min-h-screen  p-4 ${colors} `}>
                <div
                    className={`w-full max-w-md rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${colors}`}>
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Login
                    </h1>
                    <form onSubmit={handleSubmit} className={`space-y-4 ${colors}`}>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            ref={usernameRef}
                            required
                            className="w-full p-3 rounded-lg border  focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            ref={passwordRef}
                            required
                            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                            Enviar
                        </button>
                        {mensaje && (
                            <p className="text-red-500 text-center text-sm">
                                {mensaje}
                            </p>
                        )}
                    </form>
                    <p className="mt-4 text-center text-sm">
                        ¿No tienes una cuenta?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-indigo-400 hover:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
        </div>
    );
}
