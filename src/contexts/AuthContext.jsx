import { createContext, useReducer, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({
    state: {},
    actions: {},
});

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                user_id: action.payload.user_id,
                id_cliente: action.payload.id_cliente || null,
                token: action.payload.token,
                is_admin: action.payload.is_admin || null, // Almacena el rol del usuario
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                isAuthenticated: false,
                
            };
        default:
            return state;
    }
}

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        user_id: localStorage.getItem("user_id") || null,
        token: localStorage.getItem("authToken") || null,
        is_admin: localStorage.getItem("is_admin") || null,
        id_cliente: localStorage.getItem("id_cliente") || null,
        isAuthenticated: !!localStorage.getItem("authToken"),
    });
    const navigate = useNavigate();
    const location = useLocation();

    const actions = {
        login: (
            token,
            user_id,
            id_cliente = null,
            is_admin
        ) => {
            dispatch({
                type: ACTIONS.LOGIN,
                payload: {
                    token,
                    user_id,
                    is_admin,
                    id_cliente
                },
            });
            localStorage.setItem("authToken", token);
            localStorage.setItem("user_id", user_id);

            // Guarda el id_cliente y si es admin
            localStorage.setItem("is_admin", JSON.stringify(is_admin));

            if (!is_admin) {
                localStorage.setItem("id_cliente", id_cliente);
            }

            const origin = location.state?.from?.pathname || "/";
            navigate(origin);
        },
        logout: () => {
            dispatch({ type: ACTIONS.LOGOUT });
            localStorage.removeItem("authToken");
            localStorage.removeItem("user_id");
            localStorage.removeItem("is_admin");
            localStorage.removeItem("id_cliente");
            localStorage.clear();
        },
    };

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(type) {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context[type];
}

export { AuthContext, AuthProvider, useAuth };
