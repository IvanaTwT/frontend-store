import React, {useState} from "react";
export default function useTheme(){
    const [theme, setTheme ]=useState("light")
    const toggleTheme= ()=>{
        setTheme(theme === "light" ? "dark" : "light")
    }
    return [theme, toggleTheme]
}