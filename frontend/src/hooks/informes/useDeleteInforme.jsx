import Swal from "sweetalert2";
import { deleteInforme } from "@services/informe.service.js";

async function confirmDeleteInforme() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Informe eliminado",
    text: "El informe ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar el informe",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useDeleteInforme = (fetchInformes) => {
  const handleDeleteInforme = async (informeId) => {
    try {
      const isConfirmed = await confirmDeleteInforme();
      if (isConfirmed) {
        await deleteInforme(informeId);
        await confirmAlert();
        await fetchInformes();
      }
    } catch (error) {
      console.error("Error al eliminar informe:", error);
      confirmError();
    }
  };

  return { handleDeleteInforme };
};

export default useDeleteInforme;