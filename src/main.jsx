import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routes/Router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={Router} />
        <Toaster position="bottom-right" reverseOrder={false} />
    </React.StrictMode>
);
