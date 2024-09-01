import {
  FileStack,
  Users,
  FileChartColumnIncreasing,
  LogOut,
  LockKeyhole,
  UserSearch,
  ArrowUp10,
} from "lucide-react";

import sideppc from "../assets/side-ppc.png";
import { Sidebar, SidebarItem } from "../components/Sidebar";
import { CambiarPass } from "../pages/adminmant/CambiarPass";
import { useAuthStore } from "../hooks/useAuthStore";
import { useState } from "react";

export const PrinSide = () => {
  const { user, startLogout } = useAuthStore();
  const [openCambiarPass, setOpenCambiarPass] = useState(false);

  const handleOpenCambiarPass = () => setOpenCambiarPass(true);
  const handleCloseCambiarPass = () => setOpenCambiarPass(false);

  return (
    <Sidebar>
    
    <div className="flex items-center">
    <img
      src={sideppc}
      alt="Logo PPC"
      className="w-16 h-16 object-contain mr-2 bg-white"
    />
    <div className="text-center text-white">
      <p className="text-lg font-bold leading-none">PARTIDO POPULAR</p>
      <p className="text-lg font-bold leading-none">CRISTIANO</p>
    </div>
  </div>
   
      {/* Condicional para ocultar elementos si el usuario es ADMIN */}
      {user.tpuser === "01" && (
        <>
          <SidebarItem
            icon={<Users size={25} />}
            text="CREAR USUARIOS"
            to="/home/admin/tpusuario"
          />
          <SidebarItem
            icon={<UserSearch size={25} />}
            text="VER USUARIOS"
            to="/home/admin/viewusers"
          />
          <SidebarItem
            icon={<ArrowUp10 size={25} />}
            text="REGISTRAR NUMEROS"
            to="/home/admin/registrocel"
          />
          <SidebarItem
            icon={<FileChartColumnIncreasing size={25} />}
            text="CONSULTAR REGISTROS"
            to="/home/admin/registrocelvw"
          />
          
          <SidebarItem
            icon={<LockKeyhole size={20} />}
            text={
              <span>
                CAMBIAR
                <br />
                CONTRASEÑA
              </span>
            }
            to="#"
            onClick={handleOpenCambiarPass} // Aquí se abre el modal CambiarPass
          />
          <CambiarPass
            open={openCambiarPass}
            onClose={handleCloseCambiarPass}
          />
        </>
      )}

      {/* Condicional para ocultar elementos si el usuario es USER */}
      {user.tpuser === "02" && (
        <>
          <SidebarItem
            icon={<Users size={25} />}
            text="CREAR USUARIOS"
            to="/home/simadmin/tpusuariosim"
          />
          <SidebarItem
            icon={<UserSearch size={25} />}
            text="VER USUARIOS"
            to="/home/simadmin/viewusersim"
          />
          <SidebarItem
            icon={<ArrowUp10 size={25} />}
            text="REGISTRAR NUMEROS"
            to="/home/simadmin/registrocelsim"
          />
          <SidebarItem
            icon={<FileChartColumnIncreasing size={25} />}
            text="CONSULTAR REGISTROS"
            to="/home/simadmin/registrocelvwim"
          />
           
        </>
      )}
          {user.tpuser === "03" && (
        <>
           
          <SidebarItem
            icon={<ArrowUp10 size={25} />}
            text="REGISTRAR NUMEROS"
            to="/home/users/registrousers"
          />
             <SidebarItem
            icon={<FileChartColumnIncreasing size={25} />}
            text="CONSULTAR REGISTROS"
            to="/home/users/registrocelvwus"
          />
           </>
      )}

      <hr className="my-3" />
      <SidebarItem
        icon={<LogOut size={20} />}
        text="SALIR"
        onClick={startLogout}
      />
  
    </Sidebar>
  );
};
