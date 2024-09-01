import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Botón de menú para dispositivos móviles */}
      <div className="md:hidden bg-green-600 p-4 shadow-md flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isOpen && <h1 className="text-lg font-semibold text-white">Menú</h1>}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-green-600 border-r shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} md:w-64 z-50`}
        style={{ zIndex: 1000 }} // Asegura que el sidebar esté siempre encima
      >
        
        <nav className="flex flex-col space-y-4 mt-4 h-full overflow-y-auto">
          {children}
             </nav>
               
      </div>

      {/* Contenido principal */}
      <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 md:ml-64 p-4`}>
        {/* Aquí va el contenido principal de la página */}
        
      </div>
    </div>
  );
};

export const SidebarItem = ({ icon, text, to ,onClick}) => (
 
  <NavLink
    to={to}
    className="flex items-center p-2 hover:bg-green-700 cursor-pointer text-white"
    onClick={onClick} // Aquí añadimos el manejador de evento onClick
  >
    {React.cloneElement(icon, { className: "text-white" })}
    <span className="ml-4 hidden md:block">{text}</span>
  </NavLink>
 
 
);
