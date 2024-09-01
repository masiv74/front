

import {  useDispatch,useSelector} from "react-redux";
import alquilerApi from "../../api/AlquilerApi";
import { clearErrorMessage, onLogin, onLogout, onchecking,onRegistered,onNotRegister } from "../store/auth/adminSlice";
 


export const useAdminStore = () => {

    const { statuss,user,errorMessage,registerSuccess,registerMessage,statusRegis} = useSelector(state => state.admin);
    const dispatch = useDispatch();

    const startLogin = async({email,password }) => {
        dispatch (onchecking());
        try {

            const {data} = await  alquilerApi.post('/sec/admin',{email,password});
            localStorage.setItem('tokenad',data.token);
           
            dispatch(onLogin({name:data.name, uid: data.uid}));


        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'));

            setTimeout(() => {
                dispatch(clearErrorMessage());
            },10);
        }


    }

    const startRegister = async({ndocumento,name,apellidoP,apellidoM, email }) => {
        dispatch (onchecking());
        try {
            
            const {data} = await  alquilerApi.post('/auth/new',{ndocumento,name,apellidoP,apellidoM, email});
            if (data.ok) {
                let msg = '';
                // Registro exitoso
                dispatch(onRegistered( {msg: data.msg} ));
              } 
        } catch (error) {
            console.log(error)
            dispatch(onNotRegister(error.response.data?.msg|| 'mensaje no controlado'));

            setTimeout(() => {
                dispatch(clearErrorMessage());
            },10);
        }


    }

    const checkAuthToken2 = async () => {
         const token = localStorage.getItem('tokenad');
       
         if (!token) return dispatch(onLogout());
         try {
            const {data} = await alquilerApi.get('/sec/renewadmin');
            localStorage.setItem('tokenad',data.token);
           
            dispatch(onLogin({name:data.name, uid: data.uid}));
         } catch (error) {
            localStorage.clear();
            dispatch(onLogout()) ;
         }
    }
    const startLogout = () =>{
        localStorage.clear();
        dispatch(onLogout());
    }
        

    return {
        // Propiedades
        statuss,
        user,
        errorMessage,
        registerSuccess,
        registerMessage,
        statusRegis,


        //Metodos
        startLogin,
        startRegister,
        checkAuthToken2,
        startLogout
    }
}