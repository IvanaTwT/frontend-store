import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";
import Footer from "../components/Footer";
import useTheme from "../hooks/useTheme";
import ThemeContext from "../contexts/ThemeContext";
import ProductProvider from "../contexts/ProductContext";
import CartProvider  from "../contexts/CartContext";
export default function Layout() {
    const [theme, toggleTheme] = useTheme();
    return (
        <AuthProvider>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <ProductProvider>
                    <CartProvider>
                        <Navbar />
                        <Outlet />
                        <Footer />
                    </CartProvider>
                </ProductProvider>
            </ThemeContext.Provider>
        </AuthProvider>
    );
}
