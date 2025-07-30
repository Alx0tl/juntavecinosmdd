import { useState } from 'react';
import { getUsers } from '@services/user.service.js';

export const useGetUsers = () => { 
    const [users, setUsers] = useState([]);
    
    const fetchUsers = async () => {
        try {
            const response = await getUsers();

            if (!Array.isArray(response)) {
                console.warn("No se pudo cargar la lista de usuarios");
                setUsers([]); // evita errores posteriores
                return;
            }

            setUsers(response);
        } catch (error) {
            console.error("Error procesando datos de usuario:", error);
            setUsers([]); // fallback
        }
    };
    
    const dataLogged = (data) => {
        try {
            const { rut } = JSON.parse(sessionStorage.getItem("usuario"));
            for (let i = 0; i < data.length; i++) {
                if(data[i].rut === rut) {
                    data.splice(i, 1);
                    break;
                }
            }
        } catch (error) {
            console.error("Error procesando datos de usuario:", error);
        }
    }

    return { users, setUsers, fetchUsers };
}

export default useGetUsers;