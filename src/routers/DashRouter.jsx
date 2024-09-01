import React from "react";
import { useAuthStore } from '../hooks/useAuthStore';
import { Routes, Route } from "react-router-dom";
import { PrinSide } from "../pages/PrinSide"; 
import { CrearUsuarios } from "../pages/adminmant/CrearUsuarios";
import {  ViewUsuarios } from "../pages/adminmant/ViewUsuarios";
import {  ViewRegistrosCel } from "../pages/adminmant/ViewRegistrosCel";
import {   RegistroCel } from "../pages/colectorcel/RegistroCel";
import {   CrearUsuariosim } from "../pages/simad/CrearUsuariosim";
import {   ViewUsuariosim } from "../pages/simad/ViewUsuariosim";
import {    ViewRegistrosCelad } from "../pages/simad/ViewRegistrosCelad";
import {     ViewRegistrosCelus } from "../pages/users/ViewRegistrosCelus";
 

 
export const DashRouter = () => {
  const { user } = useAuthStore();
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar / Navegación */}
      <PrinSide />

      {/* Contenido Principal */}
      <div className="flex-1 p-4 overflow-auto">
        <Routes>
          <Route path="admin/tpusuario" element={<CrearUsuarios />} />
          <Route path="admin/viewusers" element={< ViewUsuarios />} />
          <Route path="admin/registrocel" element={< RegistroCel />} />
          <Route path="admin/registrocelvw" element={< ViewRegistrosCel />} />

          <Route path="simadmin/tpusuariosim" element={<CrearUsuariosim />} />
          <Route path="simadmin/viewusersim" element={< ViewUsuariosim />} />
          <Route path="simadmin/registrocelsim" element={< RegistroCel />} />
          <Route path="simadmin/registrocelvwim" element={< ViewRegistrosCelad />} />

          <Route path="users/registrousers" element={< RegistroCel />} />
          <Route path="users/registrocelvwus" element={< ViewRegistrosCelus />} />
        </Routes>
      </div>
    </div>
  );
};