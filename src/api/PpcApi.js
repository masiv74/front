import axios from 'axios';

// Reemplaza la variable de entorno con la URL deseada
const VITE_API_URL = 'https://backendppc-3myw.vercel.app/api';

const ppcApi = axios.create({
    baseURL: VITE_API_URL
});

// Configurar interceptores.
ppcApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token'),
        'x-tokenad': localStorage.getItem('tokenad')
    };
    return config;
});

export default ppcApi;
