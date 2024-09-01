import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { DashRouter } from '../routers/DashRouter';
import { Login } from '../pages/sesion/Login';
import { useAuthStore } from '../hooks/useAuthStore';
import { RegistroCelConEnlace } from "../pages/colectorcel/RegistroCelConEnlace";
export const HomeRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === 'checking') {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="h-screen flex">
      <div className="flex-1 overflow-hidden">
        <Routes>
          {status === 'not-authenticated' ? (
            <>
              <Route path="/auth" element={<Login />} />
              <Route path="/registrocelsim/:token" element={<RegistroCelConEnlace />} /> {/* Ruta pública */}
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          ) : (
            <>
              <Route path="/home/*" element={<DashRouter />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};