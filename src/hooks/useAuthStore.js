

import {  useDispatch,useSelector} from "react-redux";
import  ppcApi from "../api/PpcApi";
import { clearErrorMessage, onLogin, onLogout, onchecking } from "../store/auth/authSlice";
 



export const useAuthStore = () => {
 
    const { status,user,errorMessage,registerSuccess,registerMessage,statusRegis} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    
    
    const startLogin = async({ndocumento,password}) => {
        dispatch (onchecking());
        try {

            const {data} = await  ppcApi.post('/auth/',{ndocumento,password});
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getTime());
             
            dispatch(onLogin({nombre:data.nombre, uid: data.uid,docm:data.docm,tpuser:data.tpuser,datoP:data.datoP,distrito:data.distrito,ubigeo:data.ubigeo}));
               

        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'));

            setTimeout(() => {
                dispatch(clearErrorMessage());
            },10);
        }


    }


    const checkAuthToken = async () => {
         const token = localStorage.getItem('token');
         if (!token) return dispatch(onLogout());
         try {
            const {data} = await ppcApi.get('auth/renew');
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(onLogin({nombre:data.nombre, uid: data.uid,docm:data.docm,tpuser:data.tpuser,datoP:data.datoP,distrito:data.distrito,ubigeo:data.ubigeo}));
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
        status,
        user,
        errorMessage,
        registerSuccess,
        registerMessage,
        statusRegis,


        //Metodos
        startLogin,

        checkAuthToken,
        startLogout
    }
}