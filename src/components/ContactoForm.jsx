import { useState, useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const { theme } = useContext(ThemeContext);
  const [enviado, setEnviado] = useState(false);

  const colors =
            theme === "light"
                ? "bg-slate-100 text-gray-900"
                : "bg-slate-700 text-white";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }

    // console.log("Formulario enviado:", formData);
    setEnviado(true);
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className={`flex justify-center items-center min-h-screen p-4 ${colors} `}>
      <div className={`p-8 w-full max-w-md rounded-2xl shadow-2xl border ${colors}`}>
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Contáctanos
        </h2>

        {enviado ? (
          <div className="text-center text-green-500 font-medium">
            ¡Gracias por tu mensaje! Te responderemos pronto.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div>
              <label
                htmlFor="mensaje"
                className="block text-sm font-medium mb-1"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </div>
  );
}