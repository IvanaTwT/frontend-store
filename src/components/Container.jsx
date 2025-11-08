import ThemeContext from "../contexts/ThemeContext";
import { useContext } from "react";
export default function Container({ children }) {
    const { theme } = useContext(ThemeContext);
    // bg-gradient-to-br from-slate-900 to-gray-800

    const colors =
        theme === "light"
            ? "bg-gradient-to-br from-slate-100 to-gray-100 text-black-900 "
            : "bg-gradient-to-br from-slate-700 to-gray-700  text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)]";

    return (
        <div className={`flex items-center justify-center min-h-screen w-full p-6 ${colors}`}> {/*bg-slate-100 text-gray-800  */}
            {/* rounded-2xl  bg-white */}
            <div className={`w-full max-w-5xl min-h-[80vh]  shadow-lg  p-8 flex flex-col items-center justify-center `}> 
                {children}
            </div>
        </div>

    );
}
