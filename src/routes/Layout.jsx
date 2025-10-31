import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";
import Footer from "../components/Footer";
import useTheme from "../hooks/useTheme";
import ThemeContext from "../contexts/ThemeContext";
export default function Layout() {
    const [theme, toggleTheme] = useTheme();
    return (
        <AuthProvider>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                        <Navbar />
                        <Outlet />
                        <Footer />
            </ThemeContext.Provider>
        </AuthProvider>
    );
}
