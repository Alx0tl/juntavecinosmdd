import Swal from "sweetalert2";
import { addUser } from "@services/user.service.js";

export const useAddUser = (fetchUsers) => {
  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Miembro",
      html: `
        <input id="swal-username" class="swal2-input" placeholder="Nombre de usuario">
        <input id="swal-email" class="swal2-input" placeholder="Correo electrónico">
        <input id="swal-rut" class="swal2-input" placeholder="RUT (xx.xxx.xxx-x)">
        <input id="swal-password" class="swal2-input" placeholder="Contraseña" type="password">
        <input id="swal-direccion" class="swal2-input" placeholder="Dirección">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Añadir",
      preConfirm: () => {
        const username = document.getElementById("swal-username").value;
        const email = document.getElementById("swal-email").value;
        const rut = document.getElementById("swal-rut").value;
        const password = document.getElementById("swal-password").value;
        const direccion = document.getElementById("swal-direccion").value;
        if (!username || !email || !rut || !password || !direccion) {
          Swal.showValidationMessage("Completa todos los campos");
          return false;
        }
        return { username, email, rut, password, direccion, role: "Miembro" };
      },
    });
    if (formValues) {
      try {
        await addUser(formValues);
        Swal.fire("¡Usuario añadido!", "", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", error?.response?.data?.message || "No se pudo añadir el usuario", "error");
      }
    }
  };

  return { handleAddUser };
};

export default useAddUser;