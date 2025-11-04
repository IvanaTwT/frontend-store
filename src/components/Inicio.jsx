
import Products from "./products/Products"
import { useEffect, useState, useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
export default function Inicio(){
    const { theme } = useContext(ThemeContext);
    const colors =
            theme === "light"
                ? "bg-slate-100 text-gray-900"
                : "bg-slate-700 text-white";
    return (
        <div className={`flex items-center justify-center min-h-screen w-full p-6 ${colors}`}>
        <Products></Products>
        </div>
    )
}