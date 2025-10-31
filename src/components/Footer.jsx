import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";

export default function Footer() {
    const { theme } = useContext(ThemeContext);
    const colors =
        theme === "light"
            ? "bg-slate-200 from-slate-200 to-dark-200 text-gray-900"
            : "bg-gradient-to-br from-slate-800 to-gray-800 text-white";
    return (
        <footer
            className={`footer w-full shadow-md flex justify-center items-center p-4 ${colors}`}>
            <div className="content has-text-centered">
                <p>
                    <a href="https://instagram.com"><strong className={`${colors}`}>@Unique_Style</strong></a> por {" "}
                    <a>Flia Rebollo</a>. 
                    
                </p>
                <p>
                    Todos los creditos a 
                    <a href="https://email:mito"><strong className={`${colors}`} > @masterpiece</strong></a>
                </p>
            </div>
        </footer>
    );
}
