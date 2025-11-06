export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-200 scale-100 opacity-100 hover:scale-[1.02] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
        >
          ✖
        </button>

        {/* Título */}
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            {title}
          </h2>
        )}

        {/* Contenido */}
        <div className="text-gray-700 dark:text-gray-200 pb-6">{children}</div>
      </div>
    </div>
  );
}
