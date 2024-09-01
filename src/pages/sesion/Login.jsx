import React, { useEffect, useState } from "react";
 
import { useForm } from "../../hooks/useForm";
import { useAuthStore } from "../../hooks/useAuthStore";
import Swal from "sweetalert2";
import LogoPPC from '../../assets/Logo_Oficial_PPC.png';
import sideppc from "../../assets/side-ppc.png";

export const Login = () => {
  const { startLogin, errorMessage } = useAuthStore();
  const { ndocumento, password, onInputChange } = useForm({
    ndocumento: "",
    password: "",
  });

 

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire("Error en la autenticación", errorMessage, "error");
    }
  }, [errorMessage]);

  const onSubmit = (event) => {
    event.preventDefault();
    startLogin({ ndocumento, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div className="bg-green-600 shadow-md rounded-lg flex overflow-hidden max-w-4xl w-full ">
      {/* Logo PPC con animación de flotación */}
      <div className="hidden md:flex w-1/2 justify-center items-center bg-gradient-to-r from-gray-100 to-white">
        <div className="relative w-64 h-64 flex justify-center items-center animate-float">
          <img
            src={LogoPPC}
            alt="Logo PPC"
            className="w-60 h-60 object-contain"
          />
        </div>
      </div>

        {/* Formulario de Login */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <form className="w-full" onSubmit={onSubmit}>
            <>
            <div className="flex items-center justify-center  p-4 ">
            <img
              src={sideppc}
              alt="Logo PPC"
              className="w-24 h-24 object-contain mr-2 bg-white"
            />
            <div className="flex flex-col justify-center text-center">
              <span className="text-red-600 text-2xl font-bold leading-none">
                PARTIDO POPULAR
              </span>
              <span className="text-red-600 text-2xl  font-bold leading-none">
                CRISTIANO
              </span>
            </div>
          </div>

            <div className="mb-4">
              <label className="block  text-sm font-bold mb-2 text-red-700">
                USUARIO:
              </label>
              <input
                type="text"
                name="ndocumento"
                value={ndocumento}
                onChange={onInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
            <label className="block  text-sm font-bold mb-2 text-red-700">
                CONTRASEÑA:
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
 

            <div className="mt-6">
              <button
                type="submit"
                className="bg-red-600 hover:bg-white hover:text-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                INGRESAR
              </button>
            </div>
            </>
          </form>
        </div>
      </div>
    </div>
  );
};